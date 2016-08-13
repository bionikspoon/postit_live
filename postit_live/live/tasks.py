# coding=utf-8
from celery import shared_task
from channels import Channel

from .models import LiveChannel


@shared_task
def ping_activity():
    for channel in LiveChannel.objects.filter(status=LiveChannel.STATUS.OPENED):
        print(channel.slug)
        c = Channel('consumer.Activity')
        c.send({'slug': channel.slug})
