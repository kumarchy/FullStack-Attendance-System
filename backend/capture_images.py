import cv2
import os
import time

def capture_images(directory, num_images=30):
    
    if not os.path.exists(directory):
        os.makedirs(directory)

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    count = 0
    print("Press SPACE to capture an image. Press ESC to exit.")

    while count < num_images:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        cv2.imshow('Capture Images', frame)

        key = cv2.waitKey(1)
        
        if key == 32: #space key
            img_name = f"{directory}/image_{count+1}.jpg"
            cv2.imwrite(img_name, frame)
            print(f"{img_name} saved")
            count += 1

            time.sleep(0.5)
        
        elif key == 27: #ESC key
            print("Capture interrupted by user")
            break

    cap.release()
    cv2.destroyAllWindows()
    print(f"Captured {count} images")

# This function will be called by the Node.js server
def capture_single_image(directory, filename):
    if not os.path.exists(directory):
        os.makedirs(directory)

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    ret, frame = cap.read()
    if not ret:
        raise IOError("Failed to grab frame")

    img_path = os.path.join(directory, filename)
    cv2.imwrite(img_path, frame)

    cap.release()
    print(f"Image saved to {img_path}")

if __name__ == "__main__":
    directory_name = input("Enter the name for your image directory: ")
    roll_number = input("Enter the roll number: ")
    capture_images(f"Dataset\\{directory_name} ({roll_number})")