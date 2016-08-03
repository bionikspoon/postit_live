import logging

from channels import Group
from django.contrib.auth import get_user_model

from postit_live.user.serializers import UserSocketSerializer
from postit_live.utils import ConsumerMixin, dispatch, SerializerWebsocketConsumer
from .models import LiveChannel
from .serializers import LiveMessageSocketSerializer, LiveChannelSocketSerializer

logger = logging.getLogger(__name__)

CREATE = 'live.CREATE'
STRIKE = 'live.STRIKE'
DELETE = 'live.DELETE'
UPDATE_CHANNEL = 'live.UPDATE_CHANNEL'
AUTH_REQUIRED = 'live.AUTH_REQUIRED'

User = get_user_model()


class LiveConsumer(ConsumerMixin, SerializerWebsocketConsumer):
    http_user = True
    consumer = 'live-messages'

    def connection_groups(self, slug=None, **kwargs):
        return ['live-%s' % slug]

    def receive(self, content, slug=None, **kwargs):
        if not self.message.user.is_authenticated():
            return self.send({'type': AUTH_REQUIRED})
        content['user'] = UserSocketSerializer(self.message.user).data
        self.consumer_send(content)


def live_messages_consumer(message):
    try:
        slug = message.content['slug']
        groups = [Group(name) for name in message.content['connection_groups']]
        action = message.content['data']['type'].replace('socket', 'live', 1)
        payload = message.content['data']['payload']
        user = User.objects.get(**message.content['data']['user'])
        live_channel = LiveChannel.objects.get(slug=slug)
    except KeyError:
        return logger.error('live-messages message.content is malformed')
    except LiveChannel.DoesNotExist:
        return logger.error('live-messages channel does not exist')
    except User.DoesNotExist:
        return logger.error('live-messages user does not exist')

    if action == CREATE:
        return create_message(groups, payload['body'], user, live_channel)

    if action == STRIKE:
        return strike_message(groups, payload['id'], live_channel)

    if action == DELETE:
        return delete_message(groups, payload['id'], live_channel)

    if action == UPDATE_CHANNEL:
        return update_channel(groups, payload, live_channel)


@dispatch
def create_message(body, user, live_channel):
    live_message = live_channel.messages.create(body=body, author=user)
    serializer = LiveMessageSocketSerializer(live_message)

    return {
        'type': CREATE,
        'payload': {
            'message': serializer.data
        }
    }


@dispatch
def strike_message(message_id, live_channel):
    live_channel.messages.get(id=message_id).strike().save()

    return {
        'type': STRIKE,
        'payload': {
            'id': message_id
        }
    }


@dispatch
def delete_message(message_id, live_channel):
    live_channel.messages.get(id=message_id).delete()

    return {
        'type': DELETE,
        'payload': {
            'id': message_id
        }
    }


@dispatch
def update_channel(payload, live_channel):
    live_channel.title = payload['title']
    live_channel.description = payload['description']
    live_channel.resources = payload['resources']
    live_channel.save()

    return {
        'type': UPDATE_CHANNEL,
        'payload': LiveChannelSocketSerializer(live_channel).data
    }
