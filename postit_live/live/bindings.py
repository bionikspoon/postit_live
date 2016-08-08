# coding=utf-8
import logging
import pickle

from channels.binding.websockets import WebsocketBinding
from channels.generic.websockets import WebsocketDemultiplexer
from django.contrib.auth import get_user_model

from .models import LiveChannel, LiveMessage

logger = logging.getLogger(__name__)

User = get_user_model()


class Demultiplexer(WebsocketDemultiplexer):
    http_user = True
    channel_session_user = True
    mapping = {
        'LiveChannel': 'binding.LiveChannel',
        'LiveMessage': 'binding.LiveMessage',
    }

    def connection_groups(self, slug=None):
        slug = slug or self.kwargs['slug']
        return ['live-%s' % slug]

    def connect(self, message, **kwargs):
        logger.debug('connected message=%s', message)

    def receive(self, content, **kwargs):
        logger.debug('content received content=%s', content)
        content['payload']['kwargs'] = self.kwargs
        content['payload']['user'] = pickle.dumps(self.message.user)
        return super().receive(content, **kwargs)


class LiveChannelBinding(WebsocketBinding):
    model = LiveChannel
    stream = 'LiveChannel'
    fields = ['__all__']  # TODO

    def group_names(self, channel, action):
        return ['live-%s' % channel.slug]

    def has_permission(self, user, action, pk):
        logger.debug('LiveChannel has permission? user=%s action=%s pk=%s', user, action, pk)

        channel = LiveChannel.objects.get(pk=pk)

        # TODO
        return True


class LiveMessageBinding(WebsocketBinding):
    model = LiveMessage
    stream = 'LiveMessage'
    fields = ['__all__']  # TODO

    def group_names(self, message, action):
        channel = message.channel
        return ['live-%s' % channel.slug]

    def has_permission(self, user, action, pk):
        logger.debug('LiveMessage has permission? user=%s action=%s pk=%s', user, action, pk)

        # TODO
        return True

    def create(self, data):
        messsage = self.channel.messages.create(author=self.user, **data)
        logger.debug('created message=%s', messsage)

    def deserialize(self, message):
        if message.content.get('user'):
            setattr(message, 'user', pickle.loads(message.content.pop('user')))
        if message.content.get('kwargs'):
            self.kwargs = message.content.pop('kwargs')
            slug = self.kwargs['slug']
            self.channel = LiveChannel.objects.get(slug=slug)

        return super().deserialize(message)
