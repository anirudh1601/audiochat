"""
WSGI config for audiochat project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""
PORT = 7000

import os
import socketio
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'audiochat.settings')

application = get_wsgi_application()

import eventlet
import eventlet.wsgi
eventlet.wsgi.server(eventlet.listen(('', 7000)), application)