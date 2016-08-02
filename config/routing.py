# coding=utf-8
from channels import include
from channels import route

from postit_live.live import consumers

channel_routing = [
    include('postit_live.chat.routing.channel_routing', path=r'^/chat'),
    include('postit_live.live.routing.channel_routing'),
]
