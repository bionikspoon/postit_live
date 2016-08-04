# coding=utf-8
import logging
from functools import wraps
from io import BytesIO
from io import StringIO

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


def dispatch(function):
    @wraps(function)
    def wrapper(groups, *args):
        data = function(*args)
        action = json_dumps(data)
        [group.send({'text': action}) for group in groups]

        logger.debug('dispatch type=%s payload=%s', data['type'], json_dumps(data['payload']))
        return data

    return wrapper
