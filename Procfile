web: daphne config.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker -v2 & celery -A config worker -B -l info
