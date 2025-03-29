from django.http import JsonResponse
from .models import Quiz


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


from django.shortcuts import render

def quiz(request):
    return render(request, 'quiz.html')  # Render the quiz.html template

from django.http import JsonResponse
from .models import Leaderboard
from django.views.decorators.csrf import csrf_exempt
import json
@csrf_exempt
def save_score(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "Guest")
            score = data.get("score")

            if username and score is not None:
                Leaderboard.objects.create(username=username, score=score)
                return JsonResponse({"message": "Score saved successfully"}, status=201)
            else:
                return JsonResponse({"error": "Invalid data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def get_leaderboard(request):
    scores = Leaderboard.objects.order_by('-score', 'date')
    data = [{"username": entry.username, "score": entry.score} for entry in scores]
    return JsonResponse({"leaderboard": data})

from django.shortcuts import render
from .models import Leaderboard

def leaderboard(request):
    scores = Leaderboard.objects.order_by('-score')  # Order by highest score
    return render(request, 'leaderboard.html', {'scores': scores})