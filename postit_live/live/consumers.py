# coding=utf-8
import json
import logging
import pickle

from channels import Channel
from channels import Group
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
        'Activity': 'consumer.Activity',
    }

    def connection_groups(self, slug=None):
        slug = slug or self.kwargs['slug']
        return ['live-%s' % slug]

    def connect(self, message, **kwargs):
        Channel('consumer.Activity').send({'slug': self.kwargs['slug']})
        logger.debug('connected message=%s', message)

    def disconnect(self, message, **kwargs):
        Channel('consumer.Activity').send({'slug': self.kwargs['slug']})

        logger.debug('disconnected message=%s', message)

    def receive(self, content, **kwargs):
        logger.debug('content received content=%s', content)
        return super().receive(content, **kwargs)


def activity_consumer(message):
    group = Group('live-%s' % message['slug'])
    content = {
        'stream': 'Activity',
        'payload': {
            'model': 'live.livechannel.subscribers',
            'action': 'update',
            'data': {
                'slug': message['slug'],
                'subscribers': len(group.channel_layer.channel_layer.group_channels(group.name))
            }
        }
    }
    group.send({'text': json.dumps(content)})
    logger.debug('Activity sent payload=%s', content['payload'])
