from django.conf import settings
from django.db import models
from django.utils import timezone

from model_utils import Choices
from model_utils.models import TimeStampedModel, StatusModel


class Post(TimeStampedModel, StatusModel):
    STATUS = Choices('draft', 'published')
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=200)
    text = models.TextField()
    published_on = models.DateTimeField(blank=True, null=True)

    def publish(self):
        PostClass = self.__class__
        self.published_on = timezone.now()
        self.status = PostClass.STATUS.published

    def __repr__(self):
        PostClass = self.__class__

        return '<%s:%r>' % (PostClass.__name__, self.title)

    def __str__(self):
        return self.title