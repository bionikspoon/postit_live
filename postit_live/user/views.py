import logging

from django.contrib.auth import views, REDIRECT_FIELD_NAME

from .forms import UserAuthenticationForm

logger = logging.getLogger(__name__)


def login(request, next_page=None):
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
