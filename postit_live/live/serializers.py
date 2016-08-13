# coding=utf-8
import logging

from rest_framework import serializers

from postit_live.user.serializers import UserSocketSerializer, UserListSerializer
from .models import LiveChannel, LiveMessage, Activity

logger = logging.getLogger(__name__)


class LiveMessageSerializer(serializers.HyperlinkedModelSerializer):
    author = UserSocketSerializer()

    class Meta:
        model = LiveMessage
        fields = ('pk', 'author', 'body', 'body_html', 'created', 'status')
        extra_kwargs = {
            'url': {'view_name': 'api:message-detail'},
            'author': {'view_name': 'api:user-detail'},
            'channel': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class LiveMessageSocketSerializer(serializers.ModelSerializer):
    author = UserSocketSerializer()

    class Meta:
        model = LiveMessage
        fields = ('pk', 'author', 'body', 'body_html', 'status', 'created')
        depth = 2


class LiveChannelSerializer(serializers.HyperlinkedModelSerializer):
    messages = LiveMessageSerializer(many=True)
    contributors = serializers.SerializerMethodField()

    def get_contributors(self, channel):
        context = self.context.copy()
        context['channel'] = channel
        users = UserListSerializer(channel.contributors, many=True, context=context)
        return users.data

    class Meta:
        model = LiveChannel
        extra_kwargs = {
            'url': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
            'contributors': {'fields': ('pk', 'username', 'channel_permissions')}
        }


class LiveChannelSocketSerializer(serializers.ModelSerializer):
    contributors = UserSocketSerializer(many=True)

    class Meta:
        model = LiveChannel
        fields = (
            'pk', 'slug', 'title', 'resources', 'resources_html', 'description', 'description_html', 'status',
            'contributors', 'contributors_html'
        )


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
