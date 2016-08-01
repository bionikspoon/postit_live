from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import generics
from rest_framework import permissions
from rest_framework import renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .models import Channel, Message, Activity
from .permissions import IsAuthorOrReadOnly
from .serializers import ChannelSerializer, MessageSerializer, ActivitySerializer


def create_channel(request):
    channel = Channel.objects.create()
    return redirect('live:channel_detail', slug=channel.slug)


def channel_detail(request, slug):
    channel = get_object_or_404(Channel, slug=slug)
    return render(request, 'live/show.html', {'channel': channel})


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('api:user-list', request=request, format=format),
        'channels': reverse('live:channel-list', request=request, format=format),
        'messages': reverse('live:message-list', request=request, format=format),
        'activities': reverse('live:activity-list', request=request, format=format),
    })


class ChannelList(generics.ListCreateAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    lookup_field = 'slug'

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ChannelDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    lookup_field = 'slug'


class ChannelResources(generics.GenericAPIView):
    queryset = Channel.objects.all()
    lookup_field = 'slug'
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        channel = self.get_object()
        return Response(channel.resources_html)


class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly)


class MessageBody(generics.GenericAPIView):
    queryset = Message.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        message = self.get_object()
        return Response(message.body_html)


class ActivityList(generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
