# coding=utf-8
from channels import include

channel_routing = [
    # include('postit_live.chat.routing.channel_routing', path=r'^/chat'),
    include('postit_live.live.routing.channel_routing'),
]
