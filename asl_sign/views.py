
import os
import cv2
import sqlite3
import threading  # ✅ To run image display separately
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

# Connect to SQLite Database
DB_PATH = os.path.join(settings.BASE_DIR, 'db.sqlite3')

def input_page(request):
    return render(request, 'input_text.html')

# def text_to_sign(request):
#     text = request.GET.get('text', '').upper()  # Convert text to uppercase
#     if not text:
#         return HttpResponse("No text provided.")

#     # Fetch images for each character
#     images = []
#     with sqlite3.connect(DB_PATH) as conn:
#         cursor = conn.cursor()
#         for char in text:
#             cursor.execute("SELECT image_path FROM asl_signs WHERE character=?", (char))
#             result = cursor.fetchone()
#             if result:
#                 image_path = os.path.join(settings.BASE_DIR, result[0])  # Ensure full path
#                 if os.path.exists(image_path):  # ✅ Check if image exists
#                     images.append(image_path)
#                 else:
#                     print(f"❌ Image not found: {image_path}")  # Debugging log

#     if not images:
#         return HttpResponse("No ASL signs found for the input.")

#     # ✅ Run image display in a separate thread so Django can continue
#     threading.Thread(target=display_images_one_by_one, args=(images,), daemon=True).start()
#     return HttpResponse("✅ ASL signs are being displayed in a separate window.")
#    # return render(request, 'display_asl.html', {'image_paths': images})

def text_to_sign(request):
    text = request.GET.get('text', '').upper()  # Convert text to uppercase
    if not text:
        return HttpResponse("No text provided.")

    # Fetch images for each character
    image_urls = []
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        for char in text:
            cursor.execute("SELECT image_path FROM asl_signs WHERE character=?", (char,))
            result = cursor.fetchone()
            if result:
                image_url = os.path.join(settings.STATIC_URL, os.path.relpath(result[0], 'static'))
                image_urls.append(image_url)
    if not image_urls:
        return HttpResponse("No ASL signs found for the input.")

    return render(request, 'display_asl.html', {'image_urls': image_urls, 'input_text': text})

def display_images_one_by_one(image_paths):
    """Show images one by one in a separate window."""
    if not image_paths:
        print("No images found for display.")
        return None

    print(f"🖼️ Displaying {len(image_paths)} images one by one...")

    cv2.namedWindow("ASL Sign", cv2.WINDOW_NORMAL)  # ✅ Prevent empty black screen
    for img_path in image_paths:
        frame = cv2.imread(img_path)
        if frame is None:
            print(f"⚠️ Skipping missing/corrupted image: {img_path}")
            continue  # Skip corrupted frames

        cv2.imshow("ASL Sign", frame)  # Show image
        cv2.waitKey(1500)  # ✅ Display each image for 1.5 seconds

    cv2.destroyAllWindows()

