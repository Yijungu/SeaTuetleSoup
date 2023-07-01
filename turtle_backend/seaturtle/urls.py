from django.urls import path
from .views import RequestQaView, RequestSmView, GetQuestionView, GetStroyView, GetNnumber
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('question/', RequestQaView.as_view()),
    path('submit/', RequestSmView.as_view()),
    path('getQuestion/', GetQuestionView.as_view()),
    path('getStory/', GetStroyView.as_view()),
    path('getNnumber/', GetNnumber.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)