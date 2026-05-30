from django.shortcuts import render
from django.http import HttpResponse

def home_page(request):
    return render(request, 'homepage/homeHtml.html')

def chat_page(request):
    return render(request, 'chatPage/chatPage.html')
