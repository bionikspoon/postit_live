from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

# http://stackoverflow.com/a/12843265/2601051
RE_UUID = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'

urlpatterns = [
    url(r'^api/$', views.api_root),
    url(r'^api/channels/$', views.ChannelList.as_view(), name='channel-list'),
    url(r'^api/channels/(?P<slug>[\w-]{0,50})/$', views.ChannelDetail.as_view(), name='channel-detail'),
    url(r'^api/channels/(?P<slug>[\w-]{0,50})/resources/$', views.ChannelResources.as_view(), name='channel-resources'),
    url(r'^api/messages/$', views.MessageList.as_view(), name='message-list'),
    url(r'^api/messages/(?P<pk>%s)/$' % RE_UUID, views.MessageDetail.as_view(), name='message-detail'),
    url(r'^api/messages/(?P<pk>%s)/body/$' % RE_UUID, views.MessageBody.as_view(), name='message-body'),
    url(r'^api/activities/$', views.ActivityList.as_view(), name='activity-list'),
    url(r'^api/activities/(?P<pk>[0-9]+)/$', views.ActivityDetail.as_view(), name='activity-detail'),
    url(r'^create/$', views.create_channel, name='create_channel'),
    url(r'^(?P<slug>[\w-]{0,50})/$', views.channel_detail, name='channel_detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
