from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import renderers
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import Channel, Message, Activity
from .serializers import ChannelSerializer, MessageSerializer, ActivitySerializer


def create_channel(request):
    channel = Channel.objects.create()
    return redirect('live:channel_detail', slug=channel.slug)


def channel_detail(request, slug):
    channel = get_object_or_404(Channel, slug=slug)
    return render(request, 'live/show.html', {'channel': channel})


class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    lookup_field = 'slug'

    @detail_route(renderer_classes=[renderers.StaticHTMLRenderer])
    def resources(self, request, *args, **kwargs):
        channel = self.get_object()
        return Response(channel.resources_html)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @detail_route(renderer_classes=[renderers.StaticHTMLRenderer])
    def body(self, request, *args, **kwargs):
        message = self.get_object()
        return Response(message.body_html)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
