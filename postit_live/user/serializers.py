# coding=utf-8
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {'url': {'view_name': 'api:user-detail'}}
        fields = (
            'url', 'id', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff',
            'is_active', 'date_joined',
        )


class UserSocketSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
