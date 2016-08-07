# coding=utf-8
import logging
import pickle
from io import BytesIO

from channels import Channel
from channels import Group
from channels.generic.websockets import JsonWebsocketConsumer, WebsocketConsumer
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

TO_JSON = JSONRenderer()
FROM_JSON = JSONParser()
logger = logging.getLogger(__name__)


def json_dumps(data):
    return TO_JSON.render(data).decode('utf-8')


def json_loads(json):
    stream = BytesIO(json.encode())
    return FROM_JSON.parse(stream)


class ConsumerMixin(object):
    consumer = NotImplemented

    def consumer_send(self, content, close=False):
        message = self.kwargs.copy()

        if close:
            message["close"] = True

        message['groups'] = self.connection_groups(**self.kwargs)
        message['content'] = content
        message['reply_channel'] = self.message.reply_channel.name

        if self.message.user:
            message['user'] = pickle.dumps(self.message.user)

        Channel(self.consumer).send(message)

    @staticmethod
    def wrap_consumer(function):
        def wrapper(message, **kwargs):
            message.content['reply_channel'] = Channel(message.content['reply_channel'])
            message.content['groups'] = [Group(name) for name in message.content['groups']]
            if message.content.get('user', None):
                message.content['user'] = pickle.loads(message.content['user'])
            return function(message.content, **kwargs)

        return wrapper


class SerializerWebsocketConsumer(JsonWebsocketConsumer):
    serialize = json_dumps
    deserialize = json_loads

    def raw_receive(self, message, **kwargs):
        if "text" in message:
            self.receive(json_loads(message['text']), **kwargs)
        else:
            raise ValueError("No text section for incoming WebSocket frame!")

    def receive(self, content, **kwargs):
        """
        Called with decoded JSON content.
        """
        pass

    def send(self, content, close=False):
        super(JsonWebsocketConsumer, self).send(text=json_dumps(content), close=close)

    @classmethod
    def group_send(cls, name, content, close=False):
        WebsocketConsumer.group_send(name, text=json_dumps(content), close=close)


class ActionDispatcher(object):
    def __init__(self, *, access_denied):
        self.access_denied = access_denied
        self.registry = {}

    def __call__(self, *, action_type, payload, user, groups, reply_channel, **kwargs):
        (function, perm) = self.registry.get(action_type, (None, None))
        if function is None:
            logger.info('no handler for action type=%s', action_type)
            return None

        if perm and not user.has_perm(perm, kwargs['channel']):
            logger.warning('access denied action=%s user=%s', action_type, user)
            return self.dispatch(self.access_denied, groups=[reply_channel])

        action_payload = function(payload, user=user, **kwargs)
        self.dispatch(action_type, action_payload, groups=groups)
        return action_payload

    def action(self, action, perm=None):
        def outer_wrapper(function):
            self.registry[action] = (function, perm)

            def inner_Wrapper(*args, **kwargs):
                return function(*args, **kwargs)

            return inner_Wrapper

        return outer_wrapper

    def dispatch(self, action_type, payload=None, *, groups):
        action = json_dumps({'type': action_type, 'payload': payload})
        [group.send({'text': action}) for group in groups]
        # GROUP LENGTH
        # len(groups[0].channel_layer.channel_layer.group_channels(groups[0].name))

        logger.debug('dispatch type=%s payload=%s', action_type, payload)
