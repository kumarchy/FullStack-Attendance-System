import cv2
import dlib
import numpy as np
import pickle
from datetime import date, datetime, timedelta
from pymongo import MongoClient
import os
import re
import time

#   // await mongoose.connect('mongodb+srv://BalmikiInternational:Balmiki00@cluster0.fg0vc.mongodb.net/Balmiki_Portal').then(()=>
#   //   console.log("DB Connected")
#   // );

# MongoDB setup
client = MongoClient('mongodb+srv://BalmikiInternational:Balmiki00@cluster0.fg0vc.mongodb.net/Balmiki_Portal')
db = client['Attendances']

# Load the face encodings
with open("face_encodings.pkl", "rb") as f:
    known_face_encodings = pickle.load(f)

# Load dlib's face detector and face recognition model
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# Function to find the best match for a face encoding
def find_match(face_encoding):
    best_match = None
    best_distance = float('inf')
    for person, encodings in known_face_encodings.items():
        for encoding in encodings:
            distance = np.linalg.norm(face_encoding - encoding)
            if distance < best_distance:
                best_distance = distance
                best_match = person
    
    if best_distance > 0.6:
        return None
    return best_match

# Function to get student roll number from the folder name
def get_roll_number(student_name):
    dataset_dir = "Dataset"
    for folder in os.listdir(dataset_dir):
        if student_name in folder:
            match = re.search(r'\(([^)]+)\)', folder)
            if match:
                return match.group(1)
    return None

# Function to check if attendance has already been taken today
def attendance_already_taken():
    today = date.today().isoformat()
    collection_name = f"attendance_{today}"
    return collection_name in db.list_collection_names()

# Function to mark attendance
def mark_attendance(present_students):
    today = date.today().isoformat()
    collection_name = f"attendance_{today}"
    
    # Create a new collection for today if it doesn't exist
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
    
    daily_collection = db[collection_name]
    
    all_students = list(known_face_encodings.keys())
    
    for student in all_students:
        roll_no = get_roll_number(student)
        status = 'P' if student in present_students else 'A'
        
        try:
            # Update or insert attendance record
            result = daily_collection.update_one(
                {'student_name': student},
                {'$set': {
                    'roll_no': roll_no,
                    'status': status,
                    'timestamp': datetime.now()
                }},
                upsert=True
            )
            print(f"Updated attendance for {student} (Roll No: {roll_no}): {result.modified_count} modified, {result.upserted_id} inserted")
        except Exception as e:
            print(f"Error updating attendance for {student}: {str(e)}")

    # Verify the entries
    print(f"\nVerifying database entries for {today}:")
    for doc in daily_collection.find():
        print(doc)

# Main function to run the attendance system
def run_attendance_system():
    if attendance_already_taken():
        print("Attendance has already been taken today. The system will not record new attendance.")
        return

    cap = cv2.VideoCapture(0)
    present_students = set()

    print("Press 'q' to quit and save attendance.")

    start_time=time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame from camera. Check camera index.")
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        faces = face_detector(rgb_frame, 1)

        for face in faces:
            shape = shape_predictor(rgb_frame, face)
            face_descriptor = face_rec_model.compute_face_descriptor(rgb_frame, shape)
            match = find_match(np.array(face_descriptor))

            if match:
                present_students.add(match)

            left, top, right, bottom = face.left(), face.top(), face.right(), face.bottom()
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            label = match if match else "Unknown"
            cv2.putText(frame, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow('Attendance System', frame)

        elapsed_time = time.time() - start_time

        cv2.waitKey(1)

        if elapsed_time>30:
            break

    cap.release()
    cv2.destroyAllWindows()

    mark_attendance(present_students)

    print("Attendance marked successfully.")
    print("Present students:", present_students)
    print("Absent students:", set(known_face_encodings.keys()) - present_students)

    today = date.today().isoformat()
    collection_name = f"attendance_{today}"
    print(f"\nFinal verification of today's attendance ({collection_name}):")
    for doc in db[collection_name].find():
        print(doc)

# Run the attendance system
if __name__ == "__main__":
    run_attendance_system()