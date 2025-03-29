from django.urls import path
from .views import get_quiz,save_score

from . import views
urlpatterns = [
    path('get_quiz/<str:level>/', get_quiz, name='get_quiz'),
    path('save_score/', save_score, name='save_score'),
    path('get_leaderboard/', views.get_leaderboard, name='get_leaderboard'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('quiz/', views.quiz, name='quiz'),  
]

