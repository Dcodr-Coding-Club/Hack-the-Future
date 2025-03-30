import requests
import json
import urllib.request
import json

import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import ExtendedUserProfile, StudySchedule, Course, Exercise
from datetime import timedelta
import logging

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
    trigger_block_url = 'https://app.lemmebuild.com/workflows/99532368-3fcd-48ea-8aeb-73a42b293026?block=trigger'
    ai_block_url = 'https://app.lemmebuild.com/workflows/99532368-3fcd-48ea-8aeb-73a42b293026?block=aieqp'
    
    data = {
        'skill_level': user_profile.skill_level,
        'learning_speed': user_profile.learning_speed,
        'daily_hours': user_profile.daily_hours,
        'preferred_days': user_profile.preferred_days,
        'courses': [course.name for course in courses],
        'exercises': [exercise.name for exercise in exercises],
    }
    
    payload = {
        "input": f"Skill Level: {data['skill_level']}\nLearning Speed: {data['learning_speed']}\nDaily Hours: {data['daily_hours']}\nPreferred Days: {data['preferred_days']}\nCourses: {data['courses']}",
        "system": "Generate a study plan for a student based on their profile and preferences. Include weekly tasks and the expected completion date.",
        "question": "",
        "maxTokens": 4096,
        "temperature": 0.5
    }
    
    json_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(trigger_block_url, data=json_data, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode()
            logging.debug("Trigger Block Response: %s", response_data)  # Log response
            return json.loads(response_data)
    except urllib.error.HTTPError as e:
        error_details = e.read().decode()
        logging.error("HTTPError: %s, Details: %s", e.code, error_details)  # Log HTTP error
        return {'error': f'HTTP error occurred: {e.code}'}
    except urllib.error.URLError as e:
        logging.error("URLError: %s", e.reason)  # Log URL error
        return {'error': f'URL error occurred: {e.reason}'}
    except Exception as e:
        logging.exception("Unexpected Error")  # Log generic errors
        return {'error': f'An error occurred: {str(e)}'}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(trigger_block_url, json=payload, headers=headers)
        response.raise_for_status()
        study_plan = response.json()
        
        ai_payload = {
            "input": study_plan,
            "system": "Process and refine the study plan",
            "maxTokens": 4096,
            "temperature": 0.5
        }
        
        ai_response = requests.post(ai_block_url, json=ai_payload, headers=headers)
        ai_response.raise_for_status()
        return ai_response.json()
    
    except requests.exceptions.HTTPError as e:
        return {'error': f'HTTP error occurred: {e.response.status_code}'}
    except requests.exceptions.RequestException as e:
        return {'error': f'Error occurred: {str(e)}'}

def process_user_input(request):
    if request.method == "POST":
        user = request.user
        user_profile, created = ExtendedUserProfile.objects.get_or_create(user=user)
        
        user_profile.skill_level = request.POST.get('skill_level')
        user_profile.learning_speed = request.POST.get('learning_speed')
        user_profile.daily_hours = int(request.POST.get('daily_hours', 2))
        user_profile.preferred_days = request.POST.getlist('preferred_days')
        user_profile.save()
        
        courses = Course.objects.filter(difficulty_level=user_profile.skill_level)
        exercises = Exercise.objects.filter(course__in=courses)
        
        total_study_hours = calculate_total_study_hours(user_profile)
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

def generate_study_plan_view(request):
    if request.method == "POST":
        user = request.user
        user_profile, created = ExtendedUserProfile.objects.get_or_create(user=user)
        
        courses = Course.objects.filter(difficulty_level=user_profile.skill_level)
        exercises = Exercise.objects.filter(course__in=courses)
        
        study_plan = generate_study_plan(user_profile, courses, exercises)
        
        return JsonResponse({"study_plan": study_plan})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)
