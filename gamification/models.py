from django.db import models
from django.conf import settings

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
    GAME_CHOICES = [
        ('quiz', 'Quiz'),
        ('word_match', 'Word Match'),
        ('flashcard', 'Flashcard'),
         ('sign_typing_game', 'Sign Typing Game'),  # Added game type
    ]

    username = models.CharField(max_length=50)
    score = models.IntegerField()
    game_type = models.CharField(max_length=20, choices=GAME_CHOICES, default='quiz')  # New field
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.score} ({self.game_type})"


class WordMatchQuestion(models.Model):
    word = models.CharField(max_length=255)  # The word to match
    image = models.ImageField(upload_to="word-match/")  # Sign language image

    def __str__(self):
        return self.word


class Flashcard(models.Model):
    sign_image = models.ImageField(upload_to="flashcards/")  # Sign language image
    correct_word = models.CharField(max_length=255)  # The correct word
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)

    def __str__(self):
        return self.correct_word
    
class FlashcardScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Track scores per user
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.score} points"


class SignTypingGame(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    time_taken = models.FloatField()
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.score}"
