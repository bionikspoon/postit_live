# coding=utf-8
import logging

from django.contrib.auth import get_user_model
from guardian.shortcuts import get_perms
from rest_framework import serializers

logger = logging.getLogger(__name__)
User = get_user_model()


class UserBaseSerializer(serializers.HyperlinkedModelSerializer):
    channel_permissions = serializers.SerializerMethodField()

    def get_channel_permissions(self, user):
        channel = self.context.get('channel', None)
        if channel is None:
            return

        return get_perms(user, channel)

    class Meta:
        abstract = True
        model = User


class UserDetailsSerializer(UserBaseSerializer):
    class Meta(UserBaseSerializer.Meta):
        extra_kwargs = {'url': {'view_name': 'api:user-detail'}}
        fields = (
            'url', 'id', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff',
            'is_active', 'date_joined', 'channel_permissions',
        )


class UserListSerializer(UserBaseSerializer):
    class Meta(UserBaseSerializer.Meta):
        extra_kwargs = {'url': {'view_name': 'api:user-detail'}}
        fields = ('url', 'id', 'username', 'channel_permissions',)


class UserSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
