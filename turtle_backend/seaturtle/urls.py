from django.urls import path
from .views import my_api_view
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('question/', views.request_QA, name='request_QA'),
    path('submit/', views.request_SM, name='request_SM'),
]

urlpatterns = format_suffix_patterns(urlpatterns)