# coding=utf-8
import logging
from functools import wraps

from channels import Channel
from rest_framework.renderers import JSONRenderer

TO_JSON = JSONRenderer()
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


def dispatch(function):
    @wraps(function)
    def wrapper(groups, *args):
        data = function(*args)
        action = json_dumps(data)
        [group.send({'text': action}) for group in groups]

        logger.debug('dispatch type=%s payload=%s', data['type'], json_dumps(data['payload']))
        return data

    return wrapper
