from django.conf.urls import url, include
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework import serializers
from rest_framework import viewsets

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')
        extra_kwargs = {'url': {'view_name': 'users:detail', 'lookup_field': 'username'}}


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


router = routers.DefaultRouter(schema_title='PostIt Live Api')
router.register('users', UserViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
