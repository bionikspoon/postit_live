# coding=utf-8
import logging

from django.contrib.auth import get_user_model
from rest_framework import serializers

logger = logging.getLogger(__name__)
User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    channel_permissions = serializers.SerializerMethodField()

    def get_channel_permissions(self, *args):
        return self.context.get('perms', [])

    class Meta:
        model = User
        extra_kwargs = {'url': {'view_name': 'api:user-detail'}}
        fields = (
            'url', 'id', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff',
            'is_active', 'date_joined', 'channel_permissions',
        )


class UserSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
