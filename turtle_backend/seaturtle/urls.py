from django.urls import path
from .views import RequestQaView, RequestSmView, GetQuestionView, GetStroyView, GetNnumber, AttachJosa, SubmitProblemRequest, ChangeAiQeustion,RequestQaEnView
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('question/', RequestQaView.as_view()),
    path('submit/', RequestSmView.as_view()),
    path('getQuestion/', GetQuestionView.as_view()),
    path('getStory/', GetStroyView.as_view()),
    path('getNnumber/', GetNnumber.as_view()),
    path('getJosa/', AttachJosa.as_view()),
    path('submit_problem/', SubmitProblemRequest.as_view()),
    path('changeQuestion/', ChangeAiQeustion.as_view()),
    path('questionEn/', RequestQaEnView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)