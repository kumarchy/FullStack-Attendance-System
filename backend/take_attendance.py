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

client = MongoClient('mongodb://localhost:27017/Attendances')
# client = MongoClient('mongodb+srv://kumarChaudhary:password%40yo%40ho3@cluster0.lidwk.mongodb.net/Attendances')
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
    
    # Set a threshold for distance to consider it a match
    threshold = 0.6
    confidence = max(0, min(1, (threshold - best_distance) / threshold))  # Scales confidence between 0 and 1

    # If the best distance is too high, return None for no match
    if best_distance > threshold:
        return None, 0.0

    return best_match, confidence

def get_roll_number(student_name):
    dataset_dir = "Dataset"
    for folder in os.listdir(dataset_dir):
        if student_name in folder:
            return folder.split('(')[-1].split(')')[0]
    return None

def mark_attendance(present_students):
    today = date.today()
    formatted_date = today.strftime("%d_%b_%Y").lower()
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


def process_images(image_paths):
    all_attendance_data = []  # Store attendance for all images

    processed_images_dir = "processed_images"
    if not os.path.exists(processed_images_dir):
        os.makedirs(processed_images_dir)

    for image_path in image_paths:
        try:
            frame = cv2.imread(image_path)
            if frame is None:
                raise ValueError(f"Failed to read the image at {image_path}")
            
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            faces = face_detector(rgb_frame, 1)
            present_students = set()

            for face in faces:
                shape = shape_predictor(rgb_frame, face)
                face_descriptor = face_rec_model.compute_face_descriptor(rgb_frame, shape)
                match, confidence  = find_match(np.array(face_descriptor))

                if confidence >= 0.30:
                    present_students.add(match)

                left, top, right, bottom = face.left(), face.top(), face.right(), face.bottom()
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

                label = f"{match} ({confidence:.2f})" if confidence >= 0.30 else f"Unknown ({confidence:.2f})"
                cv2.putText(frame, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            processed_image_path = os.path.join(processed_images_dir, f"processed_{os.path.basename(image_path)}")
            cv2.imwrite(processed_image_path, frame)
            
            attendance_data = mark_attendance(present_students)
            all_attendance_data.extend(attendance_data)  # Collect results from each image
            print("all attendance data is:",all_attendance_data)

        except Exception as e:
            print(f"Error processing image {image_path}: {str(e)}", file=sys.stderr)
    
    return all_attendance_data


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python take_attendance.py <image_path1> <image_path2> ...")
        sys.exit(1)

    image_paths = sys.argv[1:]
    try:
        attendance_data = process_images(image_paths)
        print(json.dumps(attendance_data))
    except Exception as e:
        print(f"Error processing images: {str(e)}", file=sys.stderr)
        sys.exit(1)
