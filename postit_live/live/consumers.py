import json
import logging

from channels import Group
from channels.sessions import channel_session

from .models import Channel

logger = logging.getLogger(__name__)


@channel_session
def ws_connect(message, slug):
    try:
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('channel connect failed, channel does not exist slug=%s', slug)
        return

    Group('live-%s' % slug, channel_layer=message.channel_layer).add(message.reply_channel)
    message.channel_session['slug'] = slug
    logger.debug('connect slug=%s client=[%s:%s]', channel.slug, message['client'][0],message['client'][1])


@channel_session
def ws_receive(message):
    try:
        slug = message.channel_session['slug']
    except KeyError:
        logger.error('no "slug" in channel_session')
        return

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

    data['type'] = data['type'].replace('socket', 'live', 1)
    channel_message = channel.messages.create(body=data['payload']['body'])
    Group('live-%s' % slug, channel_layer=message.channel_layer).send({'text': json.dumps(data)})
    logger.debug('message sent slug=%s body=%s' % (slug, data['payload']['body']))


@channel_session
def ws_disconnect(message, slug):
    try:
        channel = Channel.objects.get(slug=slug)
    except Channel.DoesNotExist:
        logger.error('channel disconnect failed, channel does not exist slug=%s', slug)
        return

    Group('live-%s' % slug, channel_layer=message.channel_layer).discard(message.reply_channel)
    logger.debug('disconnected slug=%s', slug)
