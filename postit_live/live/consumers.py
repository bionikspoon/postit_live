# coding=utf-8
import logging
import pickle

from channels.generic.websockets import WebsocketDemultiplexer
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

User = get_user_model()


class SessionDemultiplexerMixin(object):
    def receive(self, content, **kwargs):
        content['payload']['kwargs'] = self.kwargs
        content['payload']['user'] = pickle.dumps(self.message.user)
        return super().receive(content, **kwargs)


class Demultiplexer(SessionDemultiplexerMixin, WebsocketDemultiplexer):
    http_user = True
    channel_session_user = True
    mapping = {
        'LiveChannel': 'binding.LiveChannel',
        'LiveChannelContributor': 'binding.LiveChannelContributor',
        'LiveMessage': 'binding.LiveMessage',
    }

    def connection_groups(self, slug=None):
        slug = slug or self.kwargs['slug']
        return ['live-%s' % slug]

    def connect(self, message, **kwargs):
        logger.debug('connected message=%s', message)

    def receive(self, content, **kwargs):
        logger.debug('content received content=%s', content)
        return super().receive(content, **kwargs)
