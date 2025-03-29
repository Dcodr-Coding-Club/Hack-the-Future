from django.urls import path
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from .views import signup_view, login_view, logout_view, CustomPasswordResetView, CustomPasswordResetConfirmView
from django.conf import settings
from django.conf.urls.static import static
from . import views  
from django.shortcuts import render
from gamification.views import quiz,word_match_game,flashcard_game
from .views import basic_questions


def redirect_to_login(request):
    return redirect('login')

urlpatterns = [
    path('', redirect_to_login, name='home'),
    path("signup/", signup_view, name="signup"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    
    # Password Reset
    path("password_reset/", CustomPasswordResetView.as_view(), name="password_reset"),
    path("password_reset/done/", auth_views.PasswordResetDoneView.as_view(template_name="accounts/password_reset_done.html"), name="password_reset_done"),
    path("reset/<uidb64>/<token>/", CustomPasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("reset/done/", auth_views.PasswordResetCompleteView.as_view(template_name="accounts/password_reset_complete.html"), name="password_reset_complete"),
    
    # Dashboard & Course Pages
    path('dashboard/', views.dashboard, name='dashboard'),
    
     path('alphabets/', views.alphabets, name='alphabets'),

    path('numbers/', views.numbers, name='numbers'),
    path('common_greetings/', views.common_greetings, name='common_greetings'),
    path('basic_questions/', views.basic_questions, name='basic_questions'),
    path('basic-questions/', basic_questions, name='basic_questions'),

    path('everyday_vocabulary/', views.everyday_vocabulary, name='everyday_vocabulary'),
    path('sentence_structure/', views.sentence_structure, name='sentence_structure'),
    path('expressing_feelings/', views.expressing_feelings, name='expressing_feelings'),

    path('advanced_grammar/', views.advanced_grammar, name='advanced_grammar'),
    path('signing_speed/', views.signing_speed, name='signing_speed'),
    path('storytelling/', views.storytelling, name='storytelling'),
    path("quiz/", quiz, name="quiz"),
    path("word-match/", word_match_game, name="word-match"),
    path("flashcards/",flashcard_game,name="flashcards")
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])