from django.db import models
from model_utils.models import TimeStampedModel


class Room(models.Model):
    name = models.TextField()
    label = models.SlugField(unique=True)

    def __repr__(self):
        return '<%s name=name label=label>' % (self.name, self.label)


class Message(TimeStampedModel):
    room = models.ForeignKey(Room, related_name='messages')
    handle = models.TextField()
    message = models.TextField()

    @property
    def timestamp(self):
        return self.created.isoformat()

    def as_dict(self):
        return {'handle': self.handle, 'message': self.message, 'timestamp': self.timestamp}
