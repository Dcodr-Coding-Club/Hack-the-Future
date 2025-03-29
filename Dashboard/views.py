from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse_lazy
from .forms import SignupForm, LoginForm
from .models import CustomUser


def dashboard(request):
    return render(request, "dashboard.html", {"quiz_url": "/gamification/quiz/"})
# Signup View
def signup_view(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("dashboard")
    else:
        form = SignupForm()
    return render(request, "signup.html", {"form": form})

# Login View
def login_view(request):
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect("dashboard")
    else:
        form = LoginForm()
    return render(request, "login.html", {"form": form})

# Logout View
def logout_view(request):
    logout(request)
    return redirect("login")

# Password Reset View (uses Django’s built-in view)
class CustomPasswordResetView(PasswordResetView):
    template_name = "password_reset.html"
    email_template_name = "password_reset_email.html"
    success_url = reverse_lazy("password_reset_done")

# Password Reset Confirm View
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = "password_reset_confirm.html"
    success_url = reverse_lazy("password_reset_complete")

from django.shortcuts import render



def numbers(request):
    return render(request, 'course/numbers.html')

def common_greetings(request):
    return render(request, 'course/common_greetings.html')

def basic_questions(request):
    return render(request, 'course/basic_questions.html')

def everyday_vocabulary(request):
    return render(request, 'course/everyday_vocabulary.html')

def sentence_structure(request):
    return render(request, 'course/sentence_structure.html')

def expressing_feelings(request):
    return render(request, 'course/expressing_feelings.html')

def advanced_grammar(request):
    return render(request, 'course/advanced_grammar.html')

def signing_speed(request):
    return render(request, 'course/signing_speed.html')

def storytelling(request):
    return render(request, 'course/storytelling.html')

def alphabets(request):
    return render(request, 'Alphabets.html')