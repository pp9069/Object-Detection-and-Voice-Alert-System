// Load the camera feed
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  });

// Load the object detection model
// const objectDetector = cv.imread('model.xml');

// Initialize variables for tracking the person's movement
let prevPosition = null;
let currPosition = null;

// Process each video frame to detect and track the person's movement
const processVideo = () => {
  // Load the current video frame
  const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  const cap = new cv.VideoCapture(video);
  cap.read(src);

  // Perform object detection on the video frame
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  const faces = new cv.RectVector();
  objectDetector.detectMultiScale(gray, faces);

  // Track the person's movement
  if (faces.size() > 0) {
    currPosition = [faces.get(0).x + faces.get(0).width / 2, faces.get(0).y + faces.get(0).height / 2];

    if (prevPosition !== null) {
      const diff = currPosition[0] - prevPosition[0];

      if (diff > 0) {
        console.log('Person moving towards the right');
      } else if (diff < 0) {
        console.log('Person moving towards the left');
      }
    }

    prevPosition = currPosition;
  }

  // Release memory
  src.delete();
  gray.delete();
  faces.delete();

  // Loop the video processing
  requestAnimationFrame(processVideo);
}

// Start the video processing
video.addEventListener('play', processVideo);
