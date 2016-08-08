# coding=utf-8
import logging

from channels import route
from channels import route_class

from .bindings import LiveChannelBinding, LiveMessageBinding, Demultiplexer

logger = logging.getLogger(__name__)

channel_routing = [
    # route('live-messages', consumers.live_messages_consumer),
    # route_class(consumers.LiveConsumer, path=r'^/live/(?P<slug>[\w-]{0,50})/$'),
    route_class(Demultiplexer, path=r'^/live/(?P<slug>[\w-]{0,50})/$'),
    route('binding.LiveChannel', LiveChannelBinding.consumer),
    route('binding.LiveMessage', LiveMessageBinding.consumer),
]
