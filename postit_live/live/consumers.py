import json
import logging

from channels import Group
from channels.sessions import channel_session
from rest_framework.renderers import JSONRenderer

from postit_live.live.serializers import MessageSocketSerializer
from postit_live.users.models import User
from .models import Channel

logger = logging.getLogger(__name__)

render = JSONRenderer()


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
    except KeyError:
        logger.error('no "slug" in channel_session')
        return

    group = Group('live-%s' % slug)
    logger.debug('receive group=%s', group)

    try:
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('message received, but channel does not exist slug=%s', slug)
        return

    try:
        data = json.loads(message['text'])
    except ValueError:
        logger.error('could not deserialize text=%s', message['text'])
        return

    if set(data.keys()) != {'type', 'payload'}:
        logger.error('message data malformed data=%s', data)

    response = {
        'type': data['type'].replace('socket', 'live', 1),
        'payload': {},
    }

    if response['type'] == CREATE:
        logger.debug('response.type=%s data.type=%s', response['type'], data['type'])

        # TODO, user current user
        message_obj = channel.messages.create(body=data['payload']['body'], author=User.objects.all().first())
        serializer = MessageSocketSerializer(message_obj)
        response['payload']['message'] = serializer.data

        response_text = render.render(response).decode("utf-8")
        group.send({'text': response_text})
        logger.debug('message sent slug=%s text=%s' % (slug, response_text))


@channel_session
def ws_disconnect(message, slug):
    try:
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('channel disconnect failed, channel does not exist slug=%s', slug)
        return

    group = Group('live-%s' % slug)
    logger.debug('connect group=%s', group)

    group.discard(message.reply_channel)
    logger.debug('disconnected slug=%s', slug)


CREATE = 'live.CREATE'
STRIKE = 'live.STRIKE'
DELETE = 'live.DELETE'
