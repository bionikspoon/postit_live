import logging

from django.contrib.auth import views, get_user_model
from guardian.shortcuts import get_perms
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from postit_live.live.models import LiveChannel
from .forms import UserAuthenticationForm
from .serializers import UserSerializer

logger = logging.getLogger(__name__)
User = get_user_model()


def login(request):
    return views.login(request, template_name='user/login.html', authentication_form=UserAuthenticationForm)


def logout(request):
    return views.logout(request)


def password_change(request):
    return views.password_change(request)


def password_change_done(request):
    return views.password_change_done(request)


def password_reset(request):
    return views.password_reset(request)


def password_reset_done(request):
    return views.password_reset_done(request)


def password_reset_confirm(request):
    return views.password_reset_confirm(request)


def password_reset_complete(request):
    return views.password_reset_complete(request)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_context(self):
        context = super(UserViewSet, self).get_serializer_context()

        if self.request.GET.get('channel_slug', None):
            slug = self.request.GET['channel_slug']
            channel = LiveChannel.objects.get(slug=slug)
            context['perms'] = get_perms(self.request.user, channel)
        return context

    @list_route(methods=['get'])
    def current(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
