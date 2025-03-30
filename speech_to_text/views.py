from django.views.decorators.csrf import csrf_exempt
import speech_recognition as sr
from django.http import JsonResponse
from django.shortcuts import render

def speech_to_text_home(request):
    return render(request, "index.html")

@csrf_exempt  # Add this to disable CSRF for this function
def record_and_transcribe(request):
    if request.method == "POST":
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            print("Say something... (Recording)")
            recognizer.adjust_for_ambient_noise(source)  # Reduce background noise
            audio = recognizer.listen(source)  # Capture audio

        try:
            print("Converting speech to text...")
            text = recognizer.recognize_google(audio)  # Convert speech to text
            
            # Step 1: Send text to Text-to-Sign input URL
            input_url = "http://127.0.0.1:8000/dashboard/input/"
            requests.post(input_url, json={"text": text})

            # Step 2: Fetch sign representation from Text-to-Sign output URL
            sign_url = f"http://127.0.0.1:8000/dashboard/text-to-sign/?text={text}"
            response = requests.get(sign_url)

            if response.status_code == 200:
                sign_output = response.json().get("sign_language_output")
                return JsonResponse({"transcribed_text": text, "sign_output": sign_output})
            else:
                return JsonResponse({"error": "Failed to convert text to sign"}, status=500)

        except sr.UnknownValueError:
            return JsonResponse({"error": "Could not understand the audio"}, status=400)
        except sr.RequestError:
            return JsonResponse({"error": "Error with the speech recognition service"}, status=500)
    
    return JsonResponse({"message": "Send a POST request to transcribe speech"}, status=405)