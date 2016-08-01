# coding=utf-8
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {'url': {'view_name': 'api:user-detail'}}
        fields = ('url', 'email', 'username', 'name', 'last_login', 'is_superuser', 'is_staff', 'is_active')
