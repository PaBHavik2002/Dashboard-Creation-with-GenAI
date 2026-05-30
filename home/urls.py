from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name = 'home'),
    path('chat/', views.chat_page, name = 'chat')
]