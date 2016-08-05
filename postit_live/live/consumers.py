import logging

from django.contrib.auth import get_user_model

from postit_live.utils import ConsumerMixin, SerializerWebsocketConsumer, ActionDispatcher
from .models import LiveChannel
from .serializers import LiveMessageSocketSerializer, LiveChannelSocketSerializer

logger = logging.getLogger(__name__)

CREATE_MESSAGE = 'live.CREATE_MESSAGE'
STRIKE_MESSAGE = 'live.STRIKE_MESSAGE'
DELETE_MESSAGE = 'live.DELETE_MESSAGE'
UPDATE_CHANNEL = 'live.UPDATE_CHANNEL'
CLOSE_CHANNEL = 'live.CLOSE_CHANNEL'
ADD_CONTRIBUTOR = 'live.ADD_CONTRIBUTOR'
DELETE_CONTRIBUTOR = 'live.DELETE_CONTRIBUTOR'
UPDATE_CONTRIBUTOR = 'live.UPDATE_CONTRIBUTOR'
ACCESS_DENIED = 'live.ACCESS_DENIED'

User = get_user_model()
handle = ActionDispatcher(access_denied=ACCESS_DENIED)


class LiveConsumer(ConsumerMixin, SerializerWebsocketConsumer):
    http_user = True
    consumer = 'live-messages'

    def connection_groups(self, slug=None, **kwargs):
        return ['live-%s' % slug]

    def receive(self, content, slug=None, **kwargs):
        if not self.message.user.is_authenticated():
            return self.send({'type': ACCESS_DENIED})
        self.consumer_send(content)


@LiveConsumer.wrap_consumer
def live_messages_consumer(message):
    try:
        slug = message['slug']
        action = message['content']['type'].replace('socket', 'live', 1)
        payload = message['content']['payload']

        channel = LiveChannel.objects.get(slug=slug)
    except KeyError:
        return logger.error('live-messages message.content is malformed')
    except LiveChannel.DoesNotExist:
        return logger.error('live-messages channel does not exist')
    except User.DoesNotExist:
        return logger.error('live-messages user does not exist')

    handle(action_type=action, payload=payload, channel=channel, **message)


@handle.action(CREATE_MESSAGE, perm='add_channel_messages')
def create_message(payload, *, user, channel, **_):
    body = payload['body']
    message = channel.messages.create(body=body, author=user)
    serializer = LiveMessageSocketSerializer(message)

    return {'message': serializer.data}


@handle.action(STRIKE_MESSAGE, perm='change_channel_messages')
def strike_message(payload, *, channel, **_):
    message = channel.messages.get(id=payload['id'])
    message.strike().save()

    return {'id': message.id}


@handle.action(DELETE_MESSAGE, perm='change_channel_messages')
def delete_message(payload, *, channel, **_):
    message = channel.messages.get(id=payload['id'])
    message.delete()

    return {'id': message.id}


@handle.action(UPDATE_CHANNEL, perm='change_channel_settings')
def update_channel(payload, *, channel, **_):
    channel.title = payload['title']
    channel.description = payload['description']
    channel.resources = payload['resources']
    channel.save()

    return LiveChannelSocketSerializer(channel).data


@handle.action(CLOSE_CHANNEL, perm='change_channel_close')
def close_chanel(payload, *, channel, **_):
    pass


@handle.action(ADD_CONTRIBUTOR, perm='change_channel_contributors')
def add_contributor(payload, *, channel, **_):
    pass


@handle.action(DELETE_CONTRIBUTOR, perm='change_channel_contributors')
def remove_contributor(payload, *, channel, **_):
    pass


@handle.action(UPDATE_CONTRIBUTOR, perm='change_channel_contributors')
def updaet_contributor(payload, *, channel, **_):
    pass
