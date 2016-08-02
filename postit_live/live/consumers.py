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
        return create_message(payload['body'], live_channel, groups)


def create_message(body, channel, groups):
    message = channel.messages.create(body=body, author=User.objects.all().first())
    serializer = MessageSocketSerializer(message)

    data = {
        'type': 'live.CREATE',
        'payload': {
            'message': serializer.data
        }
    }

    text = json_dumps(data)
    [group.send({'text': text}) for group in groups]

    logger.debug('message created, text=%s' % text)


def json_dumps(data):
    return TO_JSON.render(data).decode('utf-8')
