from django.urls import path
from . import views

app_name = 'AIPlanner'

urlpatterns = [
    path('process_user_input/', views.process_user_input, name='process_user_input'),
    path('generate-study-plan/', views.generate_study_plan_view, name='generate_study_plan'),
]
