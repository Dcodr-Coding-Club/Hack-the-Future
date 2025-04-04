import datetime
from django.db import models
from django.contrib.auth import get_user_model
from gamification.models import Quiz
from Dashboard.models import CustomUser

User = get_user_model()

# Extended User Profile Model
class ExtendedUserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    skill_level = models.CharField(
        max_length=20, 
        choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')]
    )
    learning_speed = models.CharField(
        max_length=10, 
        choices=[('Slow', 'Slow'), ('Moderate', 'Moderate'), ('Fast', 'Fast')]
    )
    daily_hours = models.IntegerField(default=2)
    preferred_days = models.JSONField(default=list)  # Example: ['Monday', 'Wednesday', 'Friday']

    def __str__(self):
        return f"{self.user.name}'s Profile"
    
class Course(models.Model):
    name = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=20, choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')])
    description = models.TextField()
    topics_and_hours = models.JSONField(default=dict)  # Format: { "Topic Name": hours }
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Exercise(models.Model):
    course = models.ForeignKey(Course, related_name='exercises', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    difficulty_level = models.CharField(max_length=20, choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')])
    exercises_and_hours = models.JSONField()
    
    def __str__(self):
        return self.name

# Study Schedule Model
class StudySchedule(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    skill_level = models.CharField(max_length=20)
    learning_speed = models.CharField(max_length=10)
    daily_hours = models.IntegerField()
    preferred_days = models.JSONField(default=list)
    generated_study_plan = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Study Schedule"
    
    def calculate_completion_date(self):
        user_profile = ExtendedUserProfile.objects.get(user=self.user)
        total_hours = self.course.estimated_hours
        daily_hours = user_profile.daily_hours
        days_needed = total_hours / daily_hours
        today = datetime.date.today()
        
        preferred_days = user_profile.preferred_days
        delta = datetime.timedelta(days=1)
        count = 0
        completion_date = today
        
        while count < days_needed:
            completion_date += delta
            if completion_date.strftime('%A') in preferred_days:
                count += 1
        
        return completion_date

    def save(self, *args, **kwargs):
        if not self.completion_date:
            self.completion_date = self.calculate_completion_date()
        super().save(*args, **kwargs)
