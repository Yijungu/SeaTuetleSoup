from rest_framework.views import APIView
from rest_framework.response import Response
from .qa import *
from .models import SubmitProblem
from .serializers import HintSerializer


class RequestQaView(APIView):
    def post(self, request, format=None):
        data = request.data
        ai_question ,question_text, aiQuestionKr = question(data["data"])
        if question_text is not None:
            return Response({'ai_question': ai_question, 'response': question_text, 'ai_question_kr': aiQuestionKr})
        else:
            return Response({'status': 'question is required'}, status=400)

class RequestSmView(APIView):
    def post(self, request, format=None):
        data = request.data
        ai_question, ai_question_kr,submit_text = submit(data["data"])
        if submit_text is not None:
            return Response({'ai_question': ai_question, 'ai_question_kr': ai_question_kr, 'response': submit_text})
        else:
            return Response({'status': 'submit text is required'}, status=400)

class GetQuestionView(APIView):
    def get(self, request, format=None):
        problem_text, author, main_character, hints = getProblem()
        serializer = HintSerializer(hints, many=True)

        data = {
            'question': problem_text,
            'author': author,
            'main_character': main_character,
            'hints': serializer.data
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

class SubmitProblemRequest(APIView):        
    def post(self, request, format=None):
        data = request.data
        user = data['user']            
        problem = data["problem"]
        explanation  = data['explanation']           
        try:
            new_problem = SubmitProblem(user=user, problem=problem, explanation=explanation)
            new_problem.save()
            return Response({'message': 'Successfully created problem.'}, status=201)
        except Exception as e:
            print(str(e))
            return Response({'error': str(e)}, status=400)
        
class ChangeAiQeustion(APIView):        
    def post(self, request, format=None):
        data = request.data         
        chat_response, chat_response_kr  = changeAiQeustion(data["data"])
        if chat_response is not None:
            return Response({'response': chat_response, 'response_kr':chat_response_kr})
        else:
            return Response({'status': 'submit text is required'}, status=400)

class RequestQaEnView(APIView):
    def post(self, request, format=None):
        data = request.data
        answer, content = question_en(data["data"])
        if answer is not None:
            return Response({'response': answer, 'content': content})
        else:
            return Response({'status': 'question is required'}, status=400)