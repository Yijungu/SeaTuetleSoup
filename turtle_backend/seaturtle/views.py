from django.shortcuts import render
from django.http import JsonResponse

def my_api_view(request):
    if request.method == 'POST':
        # Do something with the data...
        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'only POST method allowed'})