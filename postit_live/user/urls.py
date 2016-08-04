from django.conf.urls import url

from . import views

urlpatterns = [
    url('^login/$', views.login, name='login'),
    url('^logout/$', views.logout, name='logout'),
    url('^password_change/$ ', views.password_change, name='password_change'),
    url('^password_change/done/$', views.password_change_done, name='password_change_done'),
    url('^password_reset/$', views.password_reset, name='password_reset'),
    url('^password_reset/done/$', views.password_reset_done, name='password_reset_done'),
    url(
        '^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.password_reset_confirm,
        name='password_reset_confirm'
    ),
    url('^reset/done/$', views.password_reset_complete, name='password_reset_complete'),
]
