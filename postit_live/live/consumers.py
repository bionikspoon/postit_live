import logging

from channels import Group
from channels.generic.websockets import JsonWebsocketConsumer
from django.contrib.auth import get_user_model

from postit_live.live.serializers import MessageSocketSerializer, ChannelSocketSerializer
from postit_live.utils import ConsumerMixin, dispatch
from .models import Channel

logger = logging.getLogger(__name__)

CREATE = 'live.CREATE'
STRIKE = 'live.STRIKE'
DELETE = 'live.DELETE'
UPDATE_CHANNEL = 'live.UPDATE_CHANNEL'

User = get_user_model()

@dispatch
def create_message(body, channel):
    message = channel.messages.create(body=body, author=User.objects.all().first())
    serializer = MessageSocketSerializer(message)

    return {
        'type': CREATE,
        'payload': {
            'message': serializer.data
        }
    }


@dispatch
def strike_message(message_id, channel):
    channel.messages.get(id=message_id).strike().save()

    return {
        'type': STRIKE,
        'payload': {
            'id': message_id
        }
    }


@dispatch
def delete_message(message_id, channel):
    channel.messages.get(id=message_id).delete()

    return {
        'type': DELETE,
        'payload': {
            'id': message_id
        }
    }


@dispatch
def update_channel(payload, channel):
    channel.title = payload['title']
    channel.description = payload['description']
    channel.resources = payload['resources']
    channel.save()

    return {
        'type': UPDATE_CHANNEL,
        'payload': ChannelSocketSerializer(channel).data
    }


class LiveConsumer(ConsumerMixin, JsonWebsocketConsumer):
    channel_session = True
    consumer = 'live-messages'

    def connection_groups(self, slug=None, **kwargs):
        return ['live-%s' % slug]

    def receive(self, content, slug=None, **kwargs):
        self.consumer_send(content)


def live_messages_consumer(message):
    try:
        slug = message.content['slug']
        groups = [Group(name) for name in message.content['connection_groups']]
        action = message.content['data']['type'].replace('socket', 'live', 1)
        payload = message.content['data']['payload']
        live_channel = Channel.objects.get(slug=slug)
    except (KeyError, Channel.DoesNotExist):
        logger.error('live_messages message is malformed')
        return

    if action == CREATE:
        return create_message(groups, payload['body'], live_channel)

    if action == STRIKE:
        return strike_message(groups, payload['id'], live_channel)

    if action == DELETE:
        return delete_message(groups, payload['id'], live_channel)

    if action == UPDATE_CHANNEL:
        return update_channel(groups, payload, live_channel)
