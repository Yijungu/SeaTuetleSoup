from rest_framework.views import APIView
from rest_framework.response import Response
from .qa import question, submit, getProblem, getStory, getNnumber, attach_josa
import json

class RequestQaView(APIView):
    def post(self, request, format=None):
        data = request.data
        question_text = question(data["data"])
        if question_text is not None:
            return Response({'response': question_text})
        else:
            return Response({'status': 'question is required'}, status=400)

class RequestSmView(APIView):
    def post(self, request, format=None):
        data = request.data
        submit_text = submit(data["data"])
        if submit_text is not None:
            return Response({'response': submit_text})
        else:
            return Response({'status': 'submit text is required'}, status=400)

class GetQuestionView(APIView):
    def get(self, request, format=None):
        problem_text = getProblem()
        data = {
            'question': problem_text 
        }
        return Response(data)
    
class GetStroyView(APIView):
    def get(self, request, format=None):
        story_text = getStory()
        data = {
            'story': story_text 
        }
        return Response(data)
    
class GetNnumber(APIView):
    def get(self, request, format=None):
        n_number = getNnumber()
        data = {
            'n': n_number 
        }
        return Response(data)
    
class AttachJosa(APIView):
    def post(self, request, format=None):
        data = request.data
        attach_josa_text = attach_josa(data["data"])
        if attach_josa_text is not None:
            return Response({'response': attach_josa_text})
        else:
            return Response({'status': 'question is required'}, status=400)