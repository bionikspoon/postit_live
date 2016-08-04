from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^create/$', views.create_channel, name='create_channel'),
    url(r'^(?P<slug>[\w-]{0,50})/', views.channel_detail, name='channel_detail'),
    url(r'^(?P<slug>[\w-]{0,50})/settings/$', views.channel_detail, name='channel_detail_settings'),
]
