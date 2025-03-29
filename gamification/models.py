from django.db import models
from django.conf import settings

# Your other models follow here
class Quiz(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('High', 'High Talented'),
    ]

    question = models.TextField()
    question_image = models.ImageField(upload_to='quiz_images/', blank=True, null=True) 
    option1 = models.CharField(max_length=255)
    option1_image = models.ImageField(upload_to='quiz_images/', blank=True, null=True)  
    option2 = models.CharField(max_length=255)
    option2_image = models.ImageField(upload_to='quiz_images/', blank=True, null=True)  
    option3 = models.CharField(max_length=255)
    option3_image = models.ImageField(upload_to='quiz_images/', blank=True, null=True)  
    option4 = models.CharField(max_length=255)
    option4_image = models.ImageField(upload_to='quiz_images/', blank=True, null=True)  
    correct_answer = models.CharField(max_length=255)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Beginner')
    
    def __str__(self):
        return f"{self.level} - {self.question}"


class Leaderboard(models.Model):
    username = models.CharField(max_length=50)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.score}"

