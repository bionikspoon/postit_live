# coding=utf-8
from rest_framework import serializers

# from postit_live.users.serializers import UserSocketSerializer
from .models import Channel, Message, Activity


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'author', 'body', 'body_html', 'created', 'status')
        extra_kwargs = {
            'url': {'view_name': 'api:message-detail'},
            'author': {'view_name': 'api:user-detail'},
            'channel': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class MessageSocketSerializer(serializers.ModelSerializer):
    # author = UserSocketSerializer()

    class Meta:
        model = Message
        fields = ('id', 'author', 'body', 'body_html', 'status', 'created')
        depth = 2


class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    messages = MessageSerializer(many=True)

    class Meta:
        model = Channel
        extra_kwargs = {
            'url': {'view_name': 'api:channel-detail', 'lookup_field': 'slug'},
        }


class ChannelSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ('title', 'resources', 'resources_html', 'description', 'description_html', 'status')


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
