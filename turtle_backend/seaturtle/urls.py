from django.urls import path
from .views import my_api_view

urlpatterns = [
    path('api/my-endpoint/', my_api_view),
]