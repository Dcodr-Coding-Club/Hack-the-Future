# Speech To Text Converter
import speech_recognition as sr 

def record_and_transcribe():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print(" Say something... (Recording)")
        recognizer.adjust_for_ambient_noise(source)  # Reduce background noise
        audio = recognizer.listen(source)  # Capture audio

    try:
        print("Converting speech to text...")
        text = recognizer.recognize_google(audio)  # Convert speech to text
        print(f"Transcribed Text: {text}")

    except sr.UnknownValueError:
        print("Could not understand the audio")
    except sr.RequestError:
        print("Error with the speech recognition service")

if __name__ == "__main__":
    record_and_transcribe()
