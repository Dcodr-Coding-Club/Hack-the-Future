from django.urls import path
from .views import record_and_transcribe,speech_to_text_home

urlpatterns = [
    path('ab/', speech_to_text_home, name='speech-home'),
    path('transcribe/', record_and_transcribe, name='speech-to-text'),
]