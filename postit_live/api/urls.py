from django.contrib.auth import get_user_model
from rest_framework import routers

from postit_live.live.views import ChannelViewSet, MessageViewSet, ActivityViewSet
from postit_live.users.views import UserViewSet

User = get_user_model()

router = routers.DefaultRouter(schema_title='PostIt Live Api')
router.register('users', UserViewSet)
router.register('live/channels', ChannelViewSet, base_name='channel')
router.register('live/messages', MessageViewSet, base_name='message')
router.register('live/activities', ActivityViewSet, base_name='activity')

urlpatterns = router.urls
