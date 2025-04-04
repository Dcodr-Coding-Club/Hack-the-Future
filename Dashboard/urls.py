from django.urls import path
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from .views import signup_view, login_view, logout_view
from django.conf import settings
from django.conf.urls.static import static
from . import views  
from gamification.views import quiz,word_match_game,flashcard_game,sign_typing_game
from .views import basic_questions
from .views import vocabulary_page
from django.urls import include 
from asl_sign.views import text_to_sign,input_page
from speech_to_text.views import speech_to_text_home

def redirect_to_login(request):
    return redirect('login')

urlpatterns = [
    path('', redirect_to_login, name='home'),
    path("signup/", signup_view, name="signup"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('alphabets/', views.alphabets, name='alphabets'),
    path('numbers/', views.numbers, name='numbers'),
    path('common_greetings/', views.common_greetings, name='common_greetings'),
    path('basic_questions/', views.basic_questions, name='basic_questions'),
    path('basic-questions/', basic_questions, name='basic_questions'),
    path('vocabulary/', vocabulary_page, name='vocabulary'),
    path('sentence_structure/', views.sentence_structure, name='sentence_structure'),
    path('expressing_feelings/', views.expressing_feelings, name='expressing_feelings'),
    path('advanced_grammar/', views.advanced_grammar, name='advanced_grammar'),
    path('signing_speed/', views.signing_speed, name='signing_speed'),
    path('storytelling/', views.storytelling, name='storytelling'),
    path("quiz/", quiz, name="quiz"),
    path("word-match/", word_match_game, name="word-match"),
    path("flashcards/",flashcard_game,name="flashcards"),
    path("sign-typing-game/",sign_typing_game,name="sign-typing-game"),
    path('input/', input_page, name='input_text'), 
    path('text-to-sign/', text_to_sign, name='text_to_sign'),
    path('speech/', include('speech_to_text.urls')), 
    # path('ab/', speech_to_text_home, name='speech-home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])