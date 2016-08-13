# coding=utf-8
import logging

from channels import route, route_class

from .bindings import LiveChannelBinding, LiveMessageBinding, LiveChannelContributorBinding
from .consumers import Demultiplexer, activity_consumer

logger = logging.getLogger(__name__)

channel_routing = [
    route_class(Demultiplexer, path=r'^/live/(?P<slug>[\w-]{0,50})/$'),
    route('binding.LiveChannel', LiveChannelBinding.consumer),
    route('binding.LiveChannelContributor', LiveChannelContributorBinding.consumer),
    route('binding.LiveMessage', LiveMessageBinding.consumer),
    route('consumer.Activity', activity_consumer)
]
