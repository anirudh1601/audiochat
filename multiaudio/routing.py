from django.urls import path

from . import views

websocket_urlpatterns = [
    path('', views.connection_bind,name='connection'),
]