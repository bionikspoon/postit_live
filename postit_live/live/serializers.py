# coding=utf-8
from rest_framework import serializers

from .models import Channel, Message, Activity


class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    resources_html = serializers.HyperlinkedIdentityField(view_name='live:channel-resources', lookup_field='slug',
                                                          format='html')

    class Meta:
        model = Channel
        extra_kwargs = {
            'url': {
                'view_name': 'live:channel-detail',
                'lookup_field': 'slug'
            }
        }


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    channel = serializers.HyperlinkedRelatedField(view_name='live:channel-detail', lookup_field='slug', read_only=True)
    body_html = serializers.HyperlinkedIdentityField(view_name='live:message-body', format='html')

    class Meta:
        model = Message
        extra_kwargs = {
            'url': {
                'view_name': 'live:message-detail',
            }
        }


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
