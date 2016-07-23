# coding=utf-8
from django.core.files.storage import get_storage_class
from storages.backends.s3boto import S3BotoStorage


#  See:http://stackoverflow.com/questions/10390244/
from storages.backends.s3boto import S3BotoStorage
StaticRootS3BotoStorage = lambda: S3BotoStorage(location='static')
MediaRootS3BotoStorage = lambda: S3BotoStorage(location='media')


class CachedS3BotoStorage(S3BotoStorage):
    def __init__(self, *args, **kwargs):
        super(CachedS3BotoStorage, self).__init__(*args, **kwargs)
        StorageClass = get_storage_class('compressor.storage.CompressorFileStorage')
        self.local_storage = StorageClass()

    def save(self, name, content, max_length=None):
        self.local_storage._save(name, content)
        return super(CachedS3BotoStorage, self).save(name, self.local_storage._open(name), max_length)


class StaticRootCachedS3BotoStorage(CachedS3BotoStorage):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('location', 'static')
        super(StaticRootCachedS3BotoStorage, self).__init__(*args, **kwargs)


class MediaRootCachedS3BotoStorage(CachedS3BotoStorage):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('location', 'media')
        super(MediaRootCachedS3BotoStorage, self).__init__(*args, **kwargs)
