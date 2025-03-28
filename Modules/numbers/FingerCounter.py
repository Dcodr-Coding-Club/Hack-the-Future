import cv2
import time
import HandTracking as htm

# Camera settings
wCam, hCam = 640, 480

cap = cv2.VideoCapture(0)
cap.set(3, wCam)
cap.set(4, hCam)

pTime = 0
detector = htm.HandDetector(detectionCon=0.75, maxHands=2)

# Fingertip landmarks
tipIds = [4, 8, 12, 16, 20]

while True:
    success, img = cap.read()
    if not success:
        continue

    img = detector.findHands(img)
    hands = detector.findPosition(img, draw=False)  # Now returns multiple hands

    totalFingers = 0

    for lmList in hands:
        if len(lmList) != 0:
            fingers = []

            # Thumb (Left or Right hand check)
            if lmList[tipIds[0]][1] > lmList[tipIds[0] - 1][1]:
                fingers.append(1)  # Open
            else:
                fingers.append(0)  # Closed

            # Other fingers
            for id in range(1, 5):
                if lmList[tipIds[id]][2] < lmList[tipIds[id] - 2][2]:
                    fingers.append(1)  # Open
                else:
                    fingers.append(0)  # Closed

            totalFingers += fingers.count(1)

    print(f"Total Fingers: {totalFingers}")

    # Display total finger count
    cv2.rectangle(img, (20, 225), (200, 425), (50, 50, 50), cv2.FILLED)
    cv2.putText(img, str(totalFingers), (45, 375), cv2.FONT_HERSHEY_PLAIN,
                10, (200, 200, 200), 25)

    # FPS Calculation
    cTime = time.time()
    fps = 1 / (cTime - pTime)
    pTime = cTime

    cv2.putText(img, f'FPS: {int(fps)}', (400, 70), cv2.FONT_HERSHEY_PLAIN,
                3, (180, 180, 180), 3)

    cv2.imshow("Image", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
