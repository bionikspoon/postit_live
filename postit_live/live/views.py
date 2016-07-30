from django.shortcuts import render, redirect, get_object_or_404

from .models import Channel


def create_channel(request):
    channel = Channel.objects.create()
    return redirect('live:show_channel', slug=channel.slug)


def show_channel(request, slug):
    channel = get_object_or_404(Channel, slug=slug)
    return render(request, 'live/show.html', {'channel': channel})
