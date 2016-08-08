# coding=utf-8
import logging
import pickle

from channels.binding.websockets import WebsocketBinding
from channels.generic.websockets import WebsocketDemultiplexer
from django.contrib.auth import get_user_model

from postit_live.live.serializers import LiveMessageSocketSerializer, LiveChannelSocketSerializer
from .models import LiveChannel, LiveMessage

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


class SessionBindingMixin(object):
    def deserialize(self, message):
        if message.content.get('user'):
            setattr(message, 'user', pickle.loads(message.content.pop('user')))
        if message.content.get('kwargs'):
            self.kwargs = message.content.pop('kwargs')

        return super().deserialize(message)


class LiveChannelMixin(SessionBindingMixin):
    model = LiveChannel
    fields = ['__all__']  # TODO

    def serialize_data(self, instance):
        serializer = LiveChannelSocketSerializer(instance, context={'channel': instance})
        return serializer.data

    def deserialize(self, message):
        action, pk, data = super().deserialize(message)

        slug = self.kwargs['slug']
        self.channel = LiveChannel.objects.get(slug=slug)
        return action, pk, data


class LiveChannelBinding(LiveChannelMixin, WebsocketBinding):
    stream = 'LiveChannel'

    def group_names(self, channel, action):
        return ['live-%s' % channel.slug]

    def has_permission(self, user, action, pk):
        logger.debug('LiveChannel has permission? user=%s action=%s pk=%s', user, action, pk)

        # TODO
        return True

    def update(self, pk, data):
        for name in data.keys():
            setattr(self.channel, name, data[name])
        self.channel.save()
        logger.debug('updated channel=%s', self.channel)


class LiveChannelContributorBinding(LiveChannelMixin, WebsocketBinding):
    stream = 'LiveChannelContributor'

    @classmethod
    def trigger_outbound(cls, instance, action):
        pass

    def has_permission(self, user, action, pk):
        logger.debug('LiveChannelContributor has permission? user=%s action=%s pk=%s', user, action, pk)

        # TODO
        return True

    def create(self, data):
        logger.debug('create data=%s', data)
        try:
            user = User.objects.get(**data)
            self.channel.add_perms(user, 'full')  # TODO get perms

            logger.debug('permission granted user=%s channel=%s', user, self.channel)
        except User.DoesNotExist:
            pass

    def delete(self, _):
        try:
            user = User.objects.get(**self.data)
            self.channel.remove_perms(user)

            logger.debug('permission revoked user=%s channel=%s', user, self.channel)
        except User.DoesNotExist:
            pass


class LiveMessageBinding(SessionBindingMixin, WebsocketBinding):
    model = LiveMessage
    stream = 'LiveMessage'
    fields = ['__all__']  # TODO

    def group_names(self, message, action):
        channel = message.channel
        return ['live-%s' % channel.slug]

    def serialize_data(self, instance):
        serializer = LiveMessageSocketSerializer(instance, context={'channel': instance.channel})
        return serializer.data

    def has_permission(self, user, action, pk):
        logger.debug('LiveMessage has permission? user=%s action=%s pk=%s', user, action, pk)

        # TODO
        return True

    def create(self, data):
        messsage = self.channel.messages.create(author=self.user, **data)
        logger.debug('created message=%s', messsage)

    def deserialize(self, message):
        action, pk, data = super().deserialize(message)

        slug = self.kwargs['slug']
        self.channel = LiveChannel.objects.get(slug=slug)

        return action, pk, data
