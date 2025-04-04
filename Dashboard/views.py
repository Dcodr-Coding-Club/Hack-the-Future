from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse_lazy
from .forms import SignupForm, LoginForm
from .models import CustomUser

def dashboard(request):
    return render(request, "dashboard.html", {
        "quiz_url": "/gamification/quiz/",
        "word_match_url": "/gamification/word-match/",
        "flashcards_url": "/gamification/flashcards/",
        "typingGame_url": "/gamification/sign-typing-game/",
        "input_url": reverse_lazy('input_text'),  
        "text_to_sign_url": reverse_lazy('text_to_sign'),
        "speech_to_text_url": "/speech/ab/",
        "logout_url": reverse_lazy('logout'),
    })

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
    return render(request, 'numbers.html')

def common_greetings(request):
    return render(request, 'common_greetings.html')

def basic_questions(request):
    return render(request, 'basic_questions.html')

def everyday_vocabulary(request):
    return render(request, 'vocabulary.html')

def sentence_structure(request):
    return render(request, 'sentence_structure.html')

def expressing_feelings(request):
    return render(request, 'expressing_feelings.html')

def advanced_grammar(request):
    return render(request, 'advanced_grammar.html')

def signing_speed(request):
    return render(request, 'course/signing_speed.html')

def storytelling(request):
    return render(request, 'course/storytelling.html')

def alphabets(request):
    return render(request, 'Alphabets.html')

def basic_questions(request):
    questions = {
        "Who": "With your dominant hand, place your thumb on your chin and let your index finger wiggle from the joint.",
        "What": "Put your hands outward in front of you, with elbows bent and palms up. Shake your hands back and forth towards each other.",
        "Where": "Hold up the index finger of your dominant hand, like you're indicating 'one,' then shake it side to side.",
        "When": "Put both of your index fingers together at a 90-degree angle at the tips. Your dominant index finger then makes a full circle around the passive index finger and returns to the starting position.",
        "Which": "Make both hands into fists with your thumbs pointing up; alternate each fist in an up-and-down movement.",
        "Why": "Touch the side of your forehead with the fingers of your dominant hand, extend your thumb and pinky (in the Y sign) while you bring your hand down.",
        "How": "With fingers pointing downward and backs of fingers and knuckles touching, roll hands inward to your chest and up so that the pinky sides of your hands are touching."
    }
    return render(request, "basic_questions.html", {"questions": questions})

def vocabulary_page(request):
    return render(request, "vocabulary.html")