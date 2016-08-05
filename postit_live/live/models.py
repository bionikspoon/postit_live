import logging
import uuid

from django.conf import settings
from django.contrib.auth.models import Group
from django.db import models
from django.db import transaction
from guardian.shortcuts import assign_perm
from haikunator import Haikunator
from markdown import markdown
from model_utils import Choices
from model_utils.models import TimeStampedModel, StatusModel

logger = logging.getLogger(__name__)


class LiveChannelManager(models.Manager):
    def create_channel(self, *, user):
        channel = self.create()
        group = Group.objects.create(name='full_channel.%s' % channel.slug)
        perms = ['change_channel_close', 'change_channel_messages', 'change_channel_contributors',
                 'change_channel_settings', 'add_channel_messages']
        [assign_perm(perm, group, channel) for perm in perms]

        user.groups.add(group)
        logger.info('channel created channel=%s user=%s group=%s', channel, user, group)
        return channel


class LiveChannel(TimeStampedModel, StatusModel):
    objects = LiveChannelManager()
    STATUS = Choices('OPENED', 'CLOSED')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)

    title = models.CharField(max_length=120)

    description = models.CharField(max_length=120, null=True)
    description_html = models.TextField(editable=False)

    resources = models.TextField()
    resources_html = models.TextField(editable=False)

    contributors = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Contributor')

    def save(self, **kwargs):
        if not self.slug:
            LiveChannelClass = self.__class__
            self.slug = LiveChannelClass.create_slug()
            print(self.id, self.slug)
        self.resources_html = markdown(self.resources)
        self.description_html = markdown(self.description or '')
        return super().save(**kwargs)

    @classmethod
    def create_slug(cls):
        haikunator = Haikunator()
        while True:
            slug = haikunator.haikunate()
            with transaction.atomic():
                if cls.objects.filter(slug=slug).exists():
                    continue
            return slug

    def __str__(self):
        LiveChannelClass = self.__class__
        return '<%s slug=%s title=%s>' % (LiveChannelClass.__name__, self.slug, self.title)

    class Meta:
        permissions = (
            ('change_channel_close', 'Can permanently close live channel'),
            ('change_channel_messages', 'Can strike and delete live channel messages'),
            ('change_channel_contributors', 'Can add, change, delete permissions of other contributors'),
            ('change_channel_settings', 'Can change title and description of live channel'),
            ('add_channel_messages', 'Can post channel messages'),
        )

        default_permissions = ('add',)
        verbose_name = 'channel'


class LiveMessage(TimeStampedModel, StatusModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS = Choices('visible', 'stricken', 'deleted')
    body = models.TextField()
    body_html = models.TextField(editable=False)

    channel = models.ForeignKey(LiveChannel, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL)

    def save(self, **kwargs):
        self.body_html = markdown((self.body))
        return super().save(**kwargs)

    def strike(self):
        self.status = self.STATUS.stricken
        return self

    class Meta:
        verbose_name = 'message'


class Contributor(TimeStampedModel):
    channel = models.ForeignKey(LiveChannel, related_name='contributor_set')
    user = models.ForeignKey(settings.AUTH_USER_MODEL)


class Activity(TimeStampedModel):
    viewers = models.IntegerField()

    channel = models.ForeignKey(LiveChannel)

    class Meta:
        verbose_name = 'activity'
        verbose_name_plural = 'activities'
