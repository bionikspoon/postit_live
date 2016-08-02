import json
import logging

import channels
from channels import Group
from channels.sessions import channel_session
from rest_framework.renderers import JSONRenderer

from postit_live.live.serializers import MessageSocketSerializer
from postit_live.users.models import User
from .models import Channel

logger = logging.getLogger(__name__)

to_json = JSONRenderer()

CREATE = 'socket.CREATE'
STRIKE = 'socket.STRIKE'
DELETE = 'socket.DELETE'


def live_messages_consumer(message):
    try:
        slug = message.content['slug']
        data = json.loads(message.content['text'])
        if set(data.keys()) != {'type', 'payload'}:
            raise KeyError
    except KeyError:
        logger.error('live_messages message is malformed')
        return

    try:
        group = Group('live-%s' % slug)
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('message received, but channel does not exist slug=%s', slug)
        return

    if data['type'] == CREATE:
        return create_message(data['payload']['body'], channel, group)


def create_message(body, channel, group):
    message = channel.messages.create(body=body, author=User.objects.all().first())
    serializer = MessageSocketSerializer(message)

    data = {
        'type': 'live.CREATE',
        'payload': {
            'message': serializer.data
        }
    }

    text = to_json.render(data).decode('utf-8')
    group.send({'text': text})
    logger.debug('message created, text=%s' % text)


@channel_session
def ws_connect(message, slug):
    try:
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('channel connect failed, channel does not exist slug=%s', slug)
        return

    group = Group('live-%s' % slug)
    logger.debug('connect group=%s', group)

    group.add(message.reply_channel)
    message.channel_session['slug'] = slug
    logger.debug('connect slug=%s client=[%s:%s]', channel.slug, message['client'][0], message['client'][1])


@channel_session
def ws_receive(message):
    try:
        slug = message.channel_session['slug']
        text = message['text']
    except KeyError:
        logger.error('message is malformed')
        return

    channel = channels.Channel('live-messages')
    logger.debug('channel=%s', channel)
    return channel.send({
        'slug': slug,
        'text': text,
    })


@channel_session
def ws_disconnect(message, slug):
    try:
        Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('channel disconnect failed, channel does not exist slug=%s', slug)
        return

    group = Group('live-%s' % slug)
    group.discard(message.reply_channel)
    logger.debug('disconnected slug=%s', slug)
