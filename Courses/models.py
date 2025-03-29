from django.db import models

# Create your models here.

from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=50)
    description = models.TextField()
    topics = models.TextField()

    def __str__(self):
        return self.name
