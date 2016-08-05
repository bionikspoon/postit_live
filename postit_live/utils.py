# coding=utf-8
import logging
from io import BytesIO

from channels import Channel
from channels.generic.websockets import JsonWebsocketConsumer, WebsocketConsumer
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

TO_JSON = JSONRenderer()
FROM_JSON = JSONParser()
logger = logging.getLogger(__name__)


class ConsumerMixin(object):
    consumer = NotImplemented

    def consumer_send(self, content, close=False):
        message = self.kwargs.copy()
        if close:
            message["close"] = True

        message['connection_groups'] = self.connection_groups(**self.kwargs)
        message['data'] = content

        Channel(self.consumer).send(message)


def json_dumps(data):
    return TO_JSON.render(data).decode('utf-8')


def json_loads(json):
    stream = BytesIO(json.encode())
    return FROM_JSON.parse(stream)


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

    @staticmethod
    def wrap_consumer(function):
        def wrapper(message, **kwargs):
            return function(message.content, **kwargs)

        return wrapper


class ActionDispatcher(object):
    def __init__(self):
        self.registry = {}

    def __call__(self, *, action_type, payload, groups, **kwargs):
        function = self.registry.get(action_type, None)
        if function is None:
            logger.info('no handler for action type=%s', action_type)
            return None

        action_payload = function(payload, **kwargs)
        self.dispatch(action_type, action_payload, groups=groups)
        return action_payload

    def action(self, action):
        def outer_wrapper(function):
            self.registry[action] = function

            def inner_Wrapper(*args, **kwargs):
                return function(*args, **kwargs)

            return inner_Wrapper

        return outer_wrapper

    def dispatch(self, action_type, payload, *, groups):
        action = json_dumps({'type': action_type, 'payload': payload})
        [group.send({'text': action}) for group in groups]

        logger.debug('dispatch type=%s payload=%s', action_type, payload)
