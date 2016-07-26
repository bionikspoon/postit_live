# coding=utf-8
from channels import route

from . import consumers

channel_routing = [
    route('websocket.connect', consumers.ws_connect, path=r'^/(?P<label>[a-zA-Z0-9-]+)/$'),
    route('websocket.receive', consumers.ws_receive),
    route('websocket.disconnect', consumers.ws_disconnect, path=r'^/(?P<label>[a-zA-Z0-9-]+)/$'),
]
