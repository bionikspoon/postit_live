# coding=utf-8
from rest_framework import serializers

from postit_live.user.serializers import UserSocketSerializer
from .models import LiveChannel, LiveMessage, Activity


class LiveMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LiveMessage
        fields = ('id', 'author', 'body', 'body_html', 'created', 'status')
        extra_kwargs = {
            'url': {'view_name': 'api:message-detail'},
            'author': {'view_name': 'api:user-detail'},
            'channel': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class LiveMessageSocketSerializer(serializers.ModelSerializer):
    author = UserSocketSerializer()

    class Meta:
        model = LiveMessage
        fields = ('id', 'author', 'body', 'body_html', 'status', 'created')
        depth = 2


class LiveChannelSerializer(serializers.HyperlinkedModelSerializer):
    messages = LiveMessageSerializer(many=True)

    class Meta:
        model = LiveChannel
        extra_kwargs = {
            'url': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class LiveChannelSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveChannel
        fields = ('title', 'resources', 'resources_html', 'description', 'description_html', 'status')


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
