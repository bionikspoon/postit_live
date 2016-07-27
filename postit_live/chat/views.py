from django.db import transaction
from django.shortcuts import render, redirect
from haikunator import Haikunator

from postit_live.chat.models import Room


def about(request):
    return render(request, 'chat/about.html')


def chat_room(request, label):
    room, create = Room.objects.get_or_create(label=label)
    chat_messages = reversed(room.messages.order_by('-created')[:50])
    return render(request, 'chat/room.html', {'room': room, 'chat_messages': chat_messages})


def new_room(request):
    haikunator = Haikunator()
    room = None
    label = None
    while not room:
        with transaction.atomic():
            label = haikunator.haikunate()
            if Room.objects.filter(label=label).exists():
                continue
            room = Room.objects.create(label=label)
    return redirect('chat:chat_room', label=label)
