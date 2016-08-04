from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import renderers
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import LiveChannel, LiveMessage, Activity
from .serializers import LiveChannelSerializer, LiveMessageSerializer, ActivitySerializer

@login_required
def create_channel(request):
    channel = LiveChannel.objects.create()
    return redirect('live:channel_detail_settings', slug=channel.slug)


def channel_detail(request, slug):
    channel = get_object_or_404(LiveChannel, slug=slug)
    return render(request, 'live/show.html', {'channel': channel})


class LiveChannelViewSet(viewsets.ModelViewSet):
    queryset = LiveChannel.objects.all()
    serializer_class = LiveChannelSerializer
    lookup_field = 'slug'

    @detail_route(renderer_classes=[renderers.StaticHTMLRenderer])
    def resources(self, request, *args, **kwargs):
        channel = self.get_object()
        return Response(channel.resources_html)


class LiveMessageViewSet(viewsets.ModelViewSet):
    queryset = LiveMessage.objects.all()
    serializer_class = LiveMessageSerializer

    @detail_route(renderer_classes=[renderers.StaticHTMLRenderer])
    def body(self, request, *args, **kwargs):
        message = self.get_object()
        return Response(message.body_html)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
