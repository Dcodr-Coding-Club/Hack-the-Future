from django.db import models

class ASLSign(models.Model):
    character = models.CharField(max_length=1)  # A-Z, 0-9, space
    image_path = models.CharField(max_length=255)  # Path to image file

    def __str__(self):
        return self.character
