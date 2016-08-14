web: daphne config.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v1
worker: python manage.py runworker -v1 & celery -A postit_live.taskapp worker -B -l info && fg
