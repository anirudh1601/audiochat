"""
ASGI config for audiochat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import os
import multiaudio.routing
from channels.routing import ProtocolTypeRouter,URLRouter,ChannelNameRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'audiochat.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    #Just HTTP for now. (We can add other protocols later.)
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                multiaudio.routing.websocket_urlpatterns
            )
        )
    ),
})