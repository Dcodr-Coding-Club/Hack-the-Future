import requests
import json
import urllib.request
import json
from django.contrib.auth.decorators import login_required
import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import ExtendedUserProfile, StudySchedule, Course, Exercise
from datetime import timedelta
import logging
from .forms import RequestForm

# Configure logging
logging.basicConfig(filename='debug.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def calculate_total_study_hours(user_profile):
    skill_level = user_profile.skill_level
    courses = Course.objects.filter(difficulty_level=skill_level)
    total_hours = sum(
        sum(course.topics_and_hours.values()) + sum(ex.estimated_time for ex in Exercise.objects.filter(course=course))
        for course in courses
    )
    return total_hours

def generate_study_plan(user_profile, courses, exercises):
    workflow_url = 'https://quizzical-cohen-angry.lemme.cloud/api/99532368-3fcd-48ea-8aeb-73a42b293026'
    
    print("I'm here!!")
    print(user_profile.skill_level, user_profile.learning_speed, user_profile.daily_hours, user_profile.preferred_days)

    data = {
        "daily_hours": user_profile.daily_hours,
        "skill_level": user_profile.skill_level,
        "learning_speed": user_profile.learning_speed,
        "preferred_days": user_profile.preferred_days,
        "courses": [course.name for course in courses],
        "exercises": ['MCQ'],
        # "exercises": [exercise.name for exercise in exercises]
    }

    json_data = json.dumps(data).encode("utf-8")
    print("YEAAAAAAA", json_data)
    req = urllib.request.Request(workflow_url, data=json_data, headers={"Content-Type": "application/json"}, method="POST")
    print(req, req.data, req.headers)

    try:
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode()
            logging.debug("Trigger Block Response: %s", response_data)  # Log response
            return json.loads(response_data)
    except urllib.error.HTTPError as e:
        print(e.code, e.reason)
        print(e)
        error_details = e.read().decode()
        logging.error("HTTPError: %s, Details: %s", e.code, error_details)  # Log HTTP error
        return {'error': f'HTTP error occurred: {e.code}'}
    except urllib.error.URLError as e:
        logging.error("URLError: %s", e.reason)  # Log URL error
        return {'error': f'URL error occurred: {e.reason}'}
    except Exception as e:
        logging.exception("Unexpected Error")  # Log generic errors
        return {'error': f'An error occurred: {str(e)}'}
    
    
@login_required(login_url='/login/')
def process_user_input(request):
    if request.method == "POST":
        user = request.user
        user_profile, _ = ExtendedUserProfile.objects.get_or_create(user=user)
        
        user_profile.skill_level = request.POST.get('skill_level')
        user_profile.learning_speed = request.POST.get('learning_speed')
        user_profile.daily_hours = int(request.POST.get('daily_hours', 2))
        user_profile.preferred_days = request.POST.getlist('preferred_days')
        user_profile.save()
        
        courses = Course.objects.filter(difficulty_level=user_profile.skill_level)
        exercises = Exercise.objects.filter(course__in=courses)
        
        total_study_hours = calculate_total_study_hours(user_profile)
        print("----->", user_profile.skill_level, user_profile.learning_speed, user_profile.daily_hours, user_profile.preferred_days)
        study_plan = generate_study_plan(user_profile, courses, exercises)
        
        study_schedule = StudySchedule.objects.create(
            user=user,
            skill_level=user_profile.skill_level,
            learning_speed=user_profile.learning_speed,
            daily_hours=user_profile.daily_hours,
            preferred_days=user_profile.preferred_days,
            generated_study_plan=study_plan
        )
        
        completion_date = study_schedule.calculate_completion_date(total_study_hours)
        
        return render(request, "study_plan_result.html", {"study_plan": study_plan, "completion_date": completion_date})
    
    return render(request, "study_plan_form.html")


@login_required(login_url='/login/')
def generate_study_plan_view(request):
    if request.method == "POST":
        print("Session ID:", request.session.session_key)
        print("User:", request.user)
        print("Is authenticated:", request.user.is_authenticated)
        print("Cookies:", request.COOKIES)
        user = request.user
        print("User:", user)
        user_profile, created = ExtendedUserProfile.objects.get_or_create(user=user)

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)

        user_profile.skill_level = body['skill_level']
        user_profile.learning_speed = body['learning_speed']
        user_profile.daily_hours = int(body['daily_hours'])
        user_profile.preferred_days = [i.strip() for i in body['preferred_days'].split(',')]
        user_profile.save()

        print("User Profile:", user_profile)

        courses = Course.objects.filter(difficulty_level=user_profile.skill_level)
        exercises = Exercise.objects.filter(course__in=courses)
        
        print("---------->", user_profile.skill_level, user_profile.learning_speed, user_profile.daily_hours, user_profile.preferred_days)
        study_plan = generate_study_plan(user_profile, courses, exercises)
        
        return JsonResponse({"study_plan": study_plan})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)
