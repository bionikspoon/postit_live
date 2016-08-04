from django.contrib.auth import get_user_model
from rest_framework import routers

from postit_live.live.views import LiveChannelViewSet, LiveMessageViewSet, ActivityViewSet
from postit_live.user.views import UserViewSet

User = get_user_model()

router = routers.DefaultRouter(schema_title='PostIt Live Api')
router.register('users', UserViewSet)
router.register('live/channels', LiveChannelViewSet, base_name='channel')
router.register('live/messages', LiveMessageViewSet, base_name='message')
router.register('live/activities', ActivityViewSet, base_name='activity')

urlpatterns = router.urls
