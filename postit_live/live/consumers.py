import logging

import channels
from channels import Group
from channels.generic.websockets import JsonWebsocketConsumer
from rest_framework.renderers import JSONRenderer

from postit_live.live.serializers import MessageSocketSerializer
from postit_live.users.models import User
from .models import Channel

logger = logging.getLogger(__name__)

TO_JSON = JSONRenderer()

CREATE = 'socket.CREATE'
STRIKE = 'socket.STRIKE'
DELETE = 'socket.DELETE'


class ConsumerMixin(object):
    consumer = NotImplemented

    def consumer_send(self, content, close=False):
        message = self.kwargs.copy()
        if close:
            message["close"] = True

        message['connection_groups'] = self.connection_groups(**self.kwargs)
        message['data'] = content

        channels.Channel(self.consumer).send(message)


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
        action = message.content['data']['type']
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


def dispatch(action):
    def outer_wrapper(function):
        def inner_wrapper(groups, *args):
            data = function(*args)
            text = json_dumps(data)
            [group.send({'text': text}) for group in groups]

            logger.debug('message %s, text=%s', action, text)
            return data

        return inner_wrapper

    return outer_wrapper


@dispatch('created')
def create_message(body, channel):
    message = channel.messages.create(body=body, author=User.objects.all().first())
    serializer = MessageSocketSerializer(message)

    return {
        'type': 'live.CREATE',
        'payload': {
            'message': serializer.data
        }
    }


@dispatch('stricken')
def strike_message(message_id, channel):
    channel.messages.get(id=message_id).strike().save()

    return {
        'type': 'live.STRIKE',
        'payload': {
            'id': message_id
        }
    }


@dispatch('deleted')
def delete_message(message_id, channel):
    channel.messages.get(id=message_id).delete()

    return {
        'type': 'live.DELETE',
        'payload': {
            'id': message_id
        }
    }


def json_dumps(data):
    return TO_JSON.render(data).decode('utf-8')
