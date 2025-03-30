from django.urls import path
from .views import get_quiz,save_score

from . import views
urlpatterns = [
    path('get_quiz/<str:level>/', get_quiz, name='get_quiz'),
    path('save_score/', save_score, name='save_score'),
    path('get_leaderboard/', views.get_leaderboard, name='get_leaderboard'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('quiz/', views.quiz, name='quiz'), 
    path("word-match/", views.word_match_game, name="word_match"),
    path("word-match-leaderboard/", views.word_match_leaderboard, name="word_match_leaderboard"),
    path("flashcards/", views.flashcard_game, name="flashcard-game"),
    path("save_flashcard_score/", views.save_flashcard_score, name="save_flashcard_score"),
    path("flashcard-leaderboard/", views.flashcard_leaderboard, name="flashcard_leaderboard"),
    path("sign-typing-game/", views.sign_typing_game, name="sign_typing_game"),
    path('get-new-question/', views.get_new_question, name='get_new_question'),
    path("sign-typing-game-leaderboard/", views.sign_typing_game_leaderboard, name="sign-typing-game-leaderboard"),
]

