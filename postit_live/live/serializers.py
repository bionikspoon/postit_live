# coding=utf-8
from rest_framework import serializers

from .models import Channel, Message, Activity


class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Channel
        extra_kwargs = {
            'url': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        extra_kwargs = {
            'url': {'view_name': 'api:message-detail'},
            'author': {'view_name': 'api:user-detail'},
            'channel': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
