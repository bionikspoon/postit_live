import uuid

from django.conf import settings
from django.db import models
from django.db import transaction
from haikunator import Haikunator
from model_utils import Choices
from model_utils.models import TimeStampedModel, StatusModel


class Channel(TimeStampedModel, StatusModel):
    STATUS = Choices('opened', 'closed')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)

    title = models.TextField()
    resources = models.TextField()
    resources_html = models.TextField()

    contributors = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Contributors')

    def save(self, **kwargs):
        if not self.slug:
            ChannelClass = self.__class__
            self.slug = ChannelClass.create_slug()
            print(self.id, self.slug)
        super().save(**kwargs)

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
        ChannelClass = self.__class__
        return '<%s slug=%s title=%s>' % (ChannelClass.__name__, self.slug, self.title)


class Message(TimeStampedModel, StatusModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS = Choices('visible', 'stricken', 'deleted')
    body = models.TextField()
    body_html = models.TextField()

    channel = models.ForeignKey(Channel, related_name='messages')


class Contributors(TimeStampedModel):
    channel = models.ForeignKey(Channel, related_name='contributor_set')
    user = models.ForeignKey(settings.AUTH_USER_MODEL)


class Activity(TimeStampedModel):
    viewers = models.IntegerField()

    channel = models.ForeignKey(Channel)
