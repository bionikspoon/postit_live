# coding=utf-8
import json
import logging

from channels import Group
from channels.sessions import channel_session

from postit_live.chat.models import Room

logger = logging.getLogger(__name__)


@channel_session
def ws_connect(message, label):
    try:
        room = Room.objects.get(label=label)
    except Room.DoesNotExist:
        logger.error('ws room does not exist label=%s', label)
        return

    logger.debug('chat connect room=%s client=%s:%s', room.label, message['client'][0], message['client'][1])
    Group('chat-%s' % label, channel_layer=message.channel_layer).add(message.reply_channel)

    message.channel_session['room'] = label


@channel_session
def ws_receive(message):
    try:
        label = message.channel_session['room']
    except KeyError:
        logger.error('no room in channel_session')
        return

    try:
        room = Room.objects.get(label=label)
    except Room.DoesNotExist:
        logger.debug('received message, but room does not exist label=%s', label)
        return

    try:
        data = json.loads(message['text'])
    except ValueError:
        logger.error('ws message isn\'t json text=%s', message['text'])
        return

    if set(data.keys()) != {'handle', 'message'}:
        logger.error('ws message unexpected format data=%s', data)
        return

    if not data: return

    logger.debug('chat message room=%s handle=%s message=%s', room.label, data['handle'], data['message'])

    m = room.messages.create(**data)
    Group('chat-%s' % label, channel_layer=message.channel_layer).send({'text': json.dumps(m.as_dict())})


@channel_session
def ws_disconnect(message, label):
    try:
        room = Room.objects.get(label=label)
    except (KeyError, Room.DoesNotExist):
        logger.error('chat disconnect failed, room does not exist label=%s', label)
        return

    logger.debug('chat disconnect room=%s', room)
    Group('chat-%s' % label, channel_layer=message.channel_layer).discard(message.reply_channel)
