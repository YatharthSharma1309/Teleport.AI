
from django.urls import path
from .views import TeleportProcessView

urlpatterns = [
    path('api/teleport/', TeleportProcessView.as_view(), name='teleport'),
]
