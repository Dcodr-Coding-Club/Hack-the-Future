from django.http import JsonResponse
from .models import Quiz,Leaderboard,WordMatchQuestion,Flashcard
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import random
import os
from django.conf import settings


def get_quiz(request, level):
    quizzes = Quiz.objects.filter(level=level).order_by('?')  # Fetch all questions for the level
    if not quizzes.exists():
        return JsonResponse({"error": "No quizzes available for this level"}, status=404)

    data = []
    for quiz in quizzes:
        data.append({
            "question": quiz.question,
            "question_image": quiz.question_image.url if quiz.question_image else None,
            "options": [
                {"text": quiz.option1, "image": quiz.option1_image.url if quiz.option1_image else None},
                {"text": quiz.option2, "image": quiz.option2_image.url if quiz.option2_image else None},
                {"text": quiz.option3, "image": quiz.option3_image.url if quiz.option3_image else None},
                {"text": quiz.option4, "image": quiz.option4_image.url if quiz.option4_image else None},
            ],
            "correct_answer": quiz.correct_answer
        })

    return JsonResponse({"quizzes": data})


def quiz(request):
    return render(request, 'quiz.html')  # Render the quiz.html template

@csrf_exempt
def save_score(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "Guest")
            score = data.get("score")
            game_type = data.get("game_type", "quiz")

            if username and score is not None:
                Leaderboard.objects.create(username=username, score=score, game_type=game_type)
                return JsonResponse({"message": "Score saved successfully"}, status=201)
            else:
                return JsonResponse({"error": "Invalid data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


def get_leaderboard(request):
    game_type = request.GET.get("game_type", "quiz")  # Default to 'quiz'
    scores = Leaderboard.objects.filter(game_type=game_type).order_by('-score', 'date')
    data = [{"username": entry.username, "score": entry.score} for entry in scores]
    return JsonResponse({"leaderboard": data})

def leaderboard(request):
    scores = Leaderboard.objects.order_by('-score')  # Order by highest score
    return render(request, 'leaderboard.html', {'scores': scores})

def word_match_game(request):
    questions = WordMatchQuestion.objects.all() # Fetch questions from DB
    return render(request, "gamification/word-match.html", {"questions": questions})


def word_match_leaderboard(request):
    return render(request, "gamification/word-match-leaderboard.html")

def flashcard_game(request):
    flashcards = Flashcard.objects.all()
    
    for flashcard in flashcards:
        # Ensure the correct answer and wrong options are unique
        choices = list(set([flashcard.option1, flashcard.option2, flashcard.option3, flashcard.correct_word]))
        random.shuffle(choices)  # Shuffle options randomly
        flashcard.shuffled_options = choices  # Attach shuffled options to the flashcard object

    return render(request, "gamification/flashcard-game.html", {"flashcards": flashcards})


@csrf_exempt
def save_flashcard_score(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "Guest")
            score = data.get("score")

            if username and score is not None:
                Leaderboard.objects.create(username=username, score=score, game_type="flashcard")
                return JsonResponse({"message": "Flashcard score saved successfully"}, status=201)
            else:
                return JsonResponse({"error": "Invalid data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


def flashcard_leaderboard(request):
    scores = Leaderboard.objects.filter(game_type="flashcard").order_by('-score', 'date')
    return render(request, "gamification/flashcard-leaderboard.html", {"scores": scores})


def sign_typing_game(request):
    # Path to the folder containing sign images
    image_folder = os.path.join(settings.MEDIA_ROOT, "quiz_images")
    images = [img for img in os.listdir(image_folder) if img.endswith(".webp")]

    if images:
        # Randomly select an image
        random_image = random.choice(images)
        correct_letter = random_image.split("-")[1].upper()  # Extract the letter after "letter-"

        # Return JSON response for AJAX requests
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                "image_url": f"/media/quiz_images/{random_image}",
                "correct_letter": correct_letter
            })

        # Render the HTML template for initial page load
        return render(request, "gamification/sign_typing_game.html", {
            "image_url": f"/media/quiz_images/{random_image}",
            "correct_letter": correct_letter
        })
    else:
        return JsonResponse({"error": "No images found"}, status=404)

def get_new_question(request):
    # Assuming images are stored in 'media/quiz_images/'
    image_folder = "media/quiz_images/"
    images = [f for f in os.listdir(image_folder) if f.endswith(".webp")]

    if not images:
        return JsonResponse({"error": "No images found"}, status=404)

    # Pick a random image
    new_image = random.choice(images)
    correct_letter = new_image.split("-")[1].upper()  # Extract letter from filename

    return JsonResponse({
        "image_url": f"/{image_folder}{new_image}",
        "correct_letter": correct_letter
    })

def sign_typing_game_leaderboard(request):
    # Filter scores for the "sign_typing_game" game type
    scores = Leaderboard.objects.filter(game_type="sign_typing_game").order_by('-score', 'date')
    return render(request, "gamification/sign-typing-game-leaderboard.html", {"scores": scores})