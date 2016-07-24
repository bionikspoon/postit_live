from postit_live.blog import views

try:
    from django.conf.urls import *
except ImportError:  # django < 1.4
    from django.conf.urls.defaults import *

# place app url patterns here

urlpatterns = [
    url(r'^$', views.post_list, name='post_list'),
    url(r'^post/(?P<pk>\d+)$', views.post_detail, name='post_detail'),
    url(r'^post/new/$', views.post_new, name='post_new'),
url(r'^post/(?P<pk>\d+)/edit/$', views.post_edit, name='post_edit')
]
