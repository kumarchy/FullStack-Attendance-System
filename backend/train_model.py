import os
import dlib
import glob
import numpy as np
from skimage import io
import pickle
import requests
import bz2

def download_model(url, filename):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        response = requests.get(url)
        compressed_file = filename + ".bz2"
        with open(compressed_file, "wb") as file:
            file.write(response.content)
        
        print(f"Decompressing {filename}...")
        with bz2.BZ2File(compressed_file, "rb") as src, open(filename, "wb") as dst:
            dst.write(src.read())
        
        os.remove(compressed_file)
    else:
        print(f"{filename} already exists.")

def load_models():
    download_model("http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2", "shape_predictor_68_face_landmarks.dat")
    download_model("http://dlib.net/files/dlib_face_recognition_resnet_model_v1.dat.bz2", "dlib_face_recognition_resnet_model_v1.dat")
    
    face_detector = dlib.get_frontal_face_detector()
    shape_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")
    return face_detector, shape_predictor, face_rec_model

def process_images(dataset_path, face_detector, shape_predictor, face_rec_model):
    face_encodings = {}
    for person_dir in os.listdir(dataset_path):
        person_path = os.path.join(dataset_path, person_dir)
        if not os.path.isdir(person_path):
            continue
        
        print(f"Processing images for person: {person_dir}")
        face_encodings[person_dir] = []
        
        for img_path in glob.glob(os.path.join(person_path, "*")):
            if not os.path.isfile(img_path):
                continue
            
            print(f"Processing {img_path}")
            try:
                img = io.imread(img_path)
                
                # Check if the image is grayscale and convert to RGB if necessary
                if len(img.shape) == 2:
                    img = np.stack((img,)*3, axis=-1)
                elif img.shape[2] == 4:
                    img = img[:,:,:3]
                
                dets = face_detector(img, 1)
                if len(dets) == 0:
                    print(f"No faces detected in {img_path}")
                    continue
                
                for k, d in enumerate(dets):
                    shape = shape_predictor(img, d)
                    face_descriptor = face_rec_model.compute_face_descriptor(img, shape)
                    face_encodings[person_dir].append(np.array(face_descriptor))
            except Exception as e:
                print(f"Error processing {img_path}: {str(e)}")
    
    return face_encodings

def main():
    dataset_path = "Dataset"  # Path to your Dataset directory
    
    face_detector, shape_predictor, face_rec_model = load_models()
    
    face_encodings = process_images(dataset_path, face_detector, shape_predictor, face_rec_model)
    
    if not face_encodings:
        print("No face encodings were generated. Please check your dataset and ensure it contains valid image files with detectable faces.")
        return
    
    # Save the encodings
    with open("face_encodings.pkl", "wb") as f:
        pickle.dump(face_encodings, f)
    
    print(f"Face encodings have been saved to face_encodings.pkl")
    print(f"Total number of persons: {len(face_encodings)}")
    for person, encodings in face_encodings.items():
        print(f"  {person}: {len(encodings)} face encodings")

if __name__ == "__main__":
    main()