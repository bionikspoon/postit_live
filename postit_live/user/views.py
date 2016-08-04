import logging

from django.contrib.auth import views, get_user_model
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

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

    @list_route(methods=['get'])
    def current(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
