import logging

from django.conf import settings
from django.contrib import auth
from django.contrib.auth import views, get_user_model, REDIRECT_FIELD_NAME
from django.core.urlresolvers import reverse
from django.shortcuts import redirect, resolve_url
from django.utils.http import is_safe_url
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from guardian.shortcuts import get_perms
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from postit_live.live.models import LiveChannel
from .forms import UserAuthenticationForm, UserRegistrationForm
from .serializers import UserSerializer

logger = logging.getLogger(__name__)
User = get_user_model()


def login(request):
    registration_form = UserRegistrationForm(request=request, data=request.session.pop('registration_form', None))

    return views.login(
        request,
        template_name='user/login.html',
        authentication_form=UserAuthenticationForm,
        extra_context={'registration_form': registration_form}
    )


def logout(request):
    auth.logout(request)
    return redirect('home')


@sensitive_post_parameters()
@csrf_protect
@never_cache
def register(request):
    redirect_to = request.POST.get(REDIRECT_FIELD_NAME, request.GET.get(REDIRECT_FIELD_NAME, ''))

    if request.method != 'POST':
        query = '?next=%s' % redirect_to if redirect_to else ''
        return redirect(reverse('user:login') + query)

    form = UserRegistrationForm(request, data=request.POST)
    if not form.is_valid():
        request.session['registration_form'] = request.POST
        return redirect(reverse('user:login'))

    if not is_safe_url(url=redirect_to, host=request.get_host()):
        redirect_to = resolve_url(settings.LOGIN_REDIRECT_URL)

    user = form.save(login=True)
    logger.info('user created and logged in user=%s', user)
    return redirect(redirect_to)


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
