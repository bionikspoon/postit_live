import logging
import pickle

from channels import Group
from django.contrib.auth import get_user_model

from postit_live.utils import ConsumerMixin, SerializerWebsocketConsumer, ActionDispatcher
from .models import LiveChannel
from .serializers import LiveMessageSocketSerializer, LiveChannelSocketSerializer

logger = logging.getLogger(__name__)

CREATE_MESSAGE = 'live.CREATE_MESSAGE'
STRIKE_MESSAGE = 'live.STRIKE_MESSAGE'
DELETE_MESSAGE = 'live.DELETE_MESSAGE'
UPDATE_CHANNEL = 'live.UPDATE_CHANNEL'
AUTH_REQUIRED = 'live.AUTH_REQUIRED'

User = get_user_model()
handle = ActionDispatcher()


class LiveConsumer(ConsumerMixin, SerializerWebsocketConsumer):
    http_user = True
    consumer = 'live-messages'

    def connection_groups(self, slug=None, **kwargs):
        return ['live-%s' % slug]

    def receive(self, content, slug=None, **kwargs):
        if not self.message.user.is_authenticated():
            return self.send({'type': AUTH_REQUIRED})
        content['user'] = pickle.dumps(self.message.user)
        self.consumer_send(content)


@LiveConsumer.wrap_consumer
def live_messages_consumer(content):
    try:
        slug = content['slug']
        groups = [Group(name) for name in content['connection_groups']]
        action = content['data']['type'].replace('socket', 'live', 1)
        payload = content['data']['payload']
        user = pickle.loads(content['data']['user'])

        channel = LiveChannel.objects.get(slug=slug)
    except KeyError:
        return logger.error('live-messages message.content is malformed')
    except LiveChannel.DoesNotExist:
        return logger.error('live-messages channel does not exist')
    except User.DoesNotExist:
        return logger.error('live-messages user does not exist')

    handle(action_type=action, payload=payload, user=user, channel=channel, groups=groups)


@handle.action(CREATE_MESSAGE)
def create_message(payload, *, user, channel, **_):
    body = payload['body']
    message = channel.messages.create(body=body, author=user)
    serializer = LiveMessageSocketSerializer(message)

    return {'message': serializer.data}


@handle.action(STRIKE_MESSAGE)
def strike_message(payload, *, channel, **_):
    message = channel.messages.get(id=payload['id'])
    message.strike().save()

    return {'id': message.id}


@handle.action(DELETE_MESSAGE)
def delete_message(payload, *, channel, **_):
    message = channel.messages.get(id=payload['id'])
    message.delete()

    return {'id': message.id}


@handle.action(UPDATE_CHANNEL)
def update_channel(payload, *, channel, **_):
    channel.title = payload['title']
    channel.description = payload['description']
    channel.resources = payload['resources']
    channel.save()

    return LiveChannelSocketSerializer(channel).data
