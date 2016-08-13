web: daphne config.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v2
asgi: python manage.py runworker -v2
celery: celery -A config worker -B -l info
