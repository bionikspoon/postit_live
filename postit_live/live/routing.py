# coding=utf-8
from channels import route, route_class

from . import consumers

channel_routing = [
    route('live-messages', consumers.live_messages_consumer),
    route_class(consumers.LiveConsumer, path=r'^/live/(?P<slug>[\w-]{0,50})/$'),
]
