# coding=utf-8
from django.conf.urls import url

from postit_live.chat import views

urlpatterns = [
    url(r'^$', views.about, name='about'),
    url(r'^new/$', views.new_room, name='new_room'),
    url(r'^(?P<label>[\w-]{0,50})/$', views.chat_room, name='chat_room'),

]
