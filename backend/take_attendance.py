# import cv2
# import dlib
# import numpy as np
# import pickle
# from datetime import date, datetime, timedelta
# from pymongo import MongoClient
# from collections import OrderedDict
# import os
# import re
# import time

# #   // await mongoose.connect('mongodb+srv://BalmikiInternational:Balmiki00@cluster0.fg0vc.mongodb.net/Balmiki_Portal').then(()=>
# #   //   console.log("DB Connected")
# #   // );

# # MongoDB setup
# client = MongoClient('mongodb://localhost:27017/Attendances')
# db = client['Attendances']
# print("connection succesful")
# # Load the face encodings
# with open("face_encodings.pkl", "rb") as f:
#     known_face_encodings = pickle.load(f)

# # Load dlib's face detector and face recognition model
# face_detector = dlib.get_frontal_face_detector()
# shape_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
# face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# # Function to find the best match for a face encoding
# def find_match(face_encoding):
#     best_match = None
#     best_distance = float('inf')
#     for person, encodings in known_face_encodings.items():
#         for encoding in encodings:
#             distance = np.linalg.norm(face_encoding - encoding)
#             if distance < best_distance:
#                 best_distance = distance
#                 best_match = person
    
#     if best_distance > 0.6:
#         return None
#     return best_match

# # Function to get student roll number from the folder name
# def get_roll_number(student_name):
#     dataset_dir = "Dataset"
#     for folder in os.listdir(dataset_dir):
#         if student_name in folder:
#             match = re.search(r'\(([^)]+)\)', folder)
#             if match:
#                 return match.group(1)
#     return None

# # Function to check if attendance has already been taken today
# def attendance_already_taken():
#     today = date.today().isoformat()
#     collection_name = f"attendance_{today}"
#     return collection_name in db.list_collection_names()

# # Function to mark attendance
# def mark_attendance(present_students):
#     today = date.today()
#     formatted_date = today.strftime("%d %b %Y")
#     collection_name = f"attendance_{formatted_date}"
    
#     # Create a new collection for today if it doesn't exist
#     if collection_name not in db.list_collection_names():
#         db.create_collection(collection_name)
    
#     daily_collection = db[collection_name]
    
#     all_students = list(known_face_encodings.keys())
    
#     for student in all_students:
#         roll_no = get_roll_number(student)
#         status = 'P' if student in present_students else 'A'
#         current_time = datetime.now()
#         formatted_time = current_time.strftime("%I:%M %p")
        
#         try:
#             ordered_doc = OrderedDict([
#                 ('name', student),
#                 ('roll_number', roll_no),
#                 ('status', status),
#                 ('date', formatted_date),
#                 ('time', formatted_time)
#             ])
            
#             result = daily_collection.update_one(
#                 {'name': student},
#                 {'$set': ordered_doc},
#                 upsert=True
#             )

#             print(f"Updated attendance for {student} (Roll No: {roll_no}): {result.modified_count} modified, {result.upserted_id} inserted")
#         except Exception as e:
#             print(f"Error updating attendance for {student}: {str(e)}")

#     # Verify the entries
#     print(f"\nVerifying database entries for {today}:")
#     for doc in daily_collection.find():
#         print(doc)

# # Main function to run the attendance system
# def run_attendance_system():
#     if attendance_already_taken():
#         print("Attendance has already been taken today. The system will not record new attendance.")
#         return

#     cap = cv2.VideoCapture(0)
#     present_students = set()

#     print("Press 'q' to quit and save attendance.")

#     start_time=time.time()
    
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             print("Failed to capture frame from camera. Check camera index.")
#             break

#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         faces = face_detector(rgb_frame, 1)

#         for face in faces:
#             shape = shape_predictor(rgb_frame, face)
#             face_descriptor = face_rec_model.compute_face_descriptor(rgb_frame, shape)
#             match = find_match(np.array(face_descriptor))

#             if match:
#                 present_students.add(match)

#             left, top, right, bottom = face.left(), face.top(), face.right(), face.bottom()
#             cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

#             label = match if match else "Unknown"
#             cv2.putText(frame, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

#         cv2.imshow('Attendance System', frame)

#         elapsed_time = time.time() - start_time

#         cv2.waitKey(1)

#         if elapsed_time>20:
#             break

#     cap.release()
#     cv2.destroyAllWindows()

#     mark_attendance(present_students)

#     print("Attendance marked successfully.")
#     print("Present students:", present_students)
#     print("Absent students:", set(known_face_encodings.keys()) - present_students)

#     today = date.today().isoformat()
#     collection_name = f"attendance_{today}"
#     print(f"\nFinal verification of today's attendance ({collection_name}):")
#     for doc in db[collection_name].find():
#         print(doc)

# # Run the attendance system
# if __name__ == "__main__":
#     run_attendance_system()





# ------------------------------------------

import cv2
import dlib
import numpy as np
import pickle
from datetime import date, datetime
from pymongo import MongoClient
from collections import OrderedDict
import os
import sys
import json

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/Attendances')
db = client['Attendances']

# Load the face encodings
with open("face_encodings.pkl", "rb") as f:
    known_face_encodings = pickle.load(f)

# Load dlib's face detector and face recognition model
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

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

def get_roll_number(student_name):
    dataset_dir = "Dataset"
    for folder in os.listdir(dataset_dir):
        if student_name in folder:
            return folder.split('(')[-1].split(')')[0]
    return None

def mark_attendance(present_students):
    today = date.today()
    formatted_date = today.strftime("%d %b %Y")
    collection_name = f"attendance_{formatted_date}"
    
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
    
    daily_collection = db[collection_name]
    
    all_students = list(known_face_encodings.keys())
    attendance_data = []
    
    for student in all_students:
        roll_no = get_roll_number(student)
        status = 'P' if student in present_students else 'A'
        current_time = datetime.now()
        formatted_time = current_time.strftime("%I:%M %p")
        
        ordered_doc = OrderedDict([
            ('name', student),
            ('roll_number', roll_no),
            ('status', status),
            ('date', formatted_date),
            ('time', formatted_time)
        ])
        
        daily_collection.update_one(
            {'name': student},
            {'$set': ordered_doc},
            upsert=True
        )
        
        attendance_data.append(ordered_doc)
    
    return attendance_data

def process_image(image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        raise ValueError("Failed to read the image")
    
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    faces = face_detector(rgb_frame, 1)
    present_students = set()

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

    cv2.imwrite("processed_image.jpg", frame)
    attendance_data = mark_attendance(present_students)
    return attendance_data

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python take_attendance.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        attendance_data = process_image(image_path)
        print(json.dumps(attendance_data))
    except Exception as e:
        print(f"Error processing image: {str(e)}", file=sys.stderr)
        sys.exit(1)