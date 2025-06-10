from flask import Flask, render_template, Response
import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import threading

app = Flask(__name__)

# Initialize mediapipe, drawing utilities, and text-to-speech engine
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
engine = pyttsx3.init()

# Global variables to store exercise state
counter = 0
rep_score = 0
total_score = 0
stage = None
feedback = ""
exercise = "Shoulder Press"
last_feedback = ""  # To track previous feedback and avoid repeating it


# Function to calculate angle
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(
        a[1] - b[1], a[0] - b[0]
    )
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle


# Function to calculate score and provide suggestions based on posture accuracy
def calculate_score_and_suggestion(angle, ideal_range, exercise_type):
    if exercise_type == "Shoulder Press":
        # More granular scoring based on angle deviations
        if angle < ideal_range[0] - 20:
            return 4, "Press your arms higher."
        elif angle < ideal_range[0] - 10:
            return 5, "Press your arms higher."
        elif angle >= ideal_range[0] and angle <= ideal_range[1]:
            return 10, "Good form!"
        elif angle > ideal_range[1] + 10:
            return 5, "Lower your arms down."
        elif angle > ideal_range[1] + 20:
            return 4, "Lower your arms down."

    return 7, ""  # Default feedback for other cases


# Function to give audio feedback for incorrect posture
def give_audio_feedback(message):
    global last_feedback
    if (
        message and message != last_feedback
    ):  # Only play audio if feedback is new or changed

        def speak():
            engine.say(message)
            engine.runAndWait()

        threading.Thread(target=speak).start()
        last_feedback = message  # Update the last feedback after playing audio


# Video capture function to handle frames and exercise detection
def generate_frames():
    global counter, rep_score, total_score, stage, feedback
    cap = cv2.VideoCapture(0)

    with mp_pose.Pose(
        min_detection_confidence=0.7, min_tracking_confidence=0.7
    ) as pose:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image)

            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                landmarks = results.pose_landmarks.landmark

                shoulder = [
                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y,
                ]
                elbow = [
                    landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y,
                ]
                wrist = [
                    landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y,
                ]

                elbow_angle = calculate_angle(shoulder, elbow, wrist)

                if elbow_angle > 160:
                    stage = "down"
                if elbow_angle < 60 and stage == "down":
                    stage = "up"
                    counter += 1
                    rep_score, feedback = calculate_score_and_suggestion(
                        elbow_angle, (60, 160), "Shoulder Press"
                    )
                    total_score += rep_score

                    if rep_score < 7:
                        give_audio_feedback(feedback)

            except Exception as e:
                print("Error:", e)

            # Show rep count and score on the frame
            cv2.putText(
                image,
                f"Reps: {counter}",
                (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                2,
            )
            cv2.putText(
                image,
                f"Score: {rep_score}",
                (10, 90),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )
            cv2.putText(
                image, feedback, (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2
            )

            # Render pose landmarks
            mp_drawing.draw_landmarks(
                image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
            )

            _, buffer = cv2.imencode(".jpg", image)
            frame = buffer.tobytes()
            yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

    cap.release()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
