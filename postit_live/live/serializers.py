# coding=utf-8
from rest_framework import serializers

from postit_live.users.serializers import UserSocketSerializer
from .models import Channel, Message, Activity


class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Channel
        extra_kwargs = {
            'url': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class ChannelSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        extra_kwargs = {
            'url': {'view_name': 'api:message-detail'},
            'author': {'view_name': 'api:user-detail'},
            'channel': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class MessageSocketSerializer(serializers.ModelSerializer):
    author = UserSocketSerializer()

    class Meta:
        model = Message
        fields = ('id', 'author', 'body', 'body_html', 'stricken', 'created')
        depth = 2


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
