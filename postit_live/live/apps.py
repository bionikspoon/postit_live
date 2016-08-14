import logging

from django.apps import AppConfig

logger = logging.getLogger(__name__)


class LiveConfig(AppConfig):
    name = 'postit_live.live'

    def ready(self):
        from . import tasks  # noqa

        logger.debug('ready tasks=%s', tasks)
