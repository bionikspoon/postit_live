# coding=utf-8
from channels import include

channel_routing = [
    include('postit_live.live.routing.channel_routing'),
]
