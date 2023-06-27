from django.shortcuts import render
from django.http import JsonResponse
from .qa import question, submit
import json

def request_QA(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question_text = data['question']
        reponse = question(question_text)
        
        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'only POST method allowed'})
    

def request_SM(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        submit_text = data['submit']
        reponse = submit(submit_text)

        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'only POST method allowed'})