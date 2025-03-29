from django.urls import path
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from .views import signup_view, login_view, logout_view, CustomPasswordResetView, CustomPasswordResetConfirmView
from . import views
from django.conf import settings
from django.conf.urls.static import static
from gamification.views import get_quiz

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
    path('dashboard/', views.dashboard, name='dashboard'),
    path("quiz/",get_quiz,name="quiz"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])