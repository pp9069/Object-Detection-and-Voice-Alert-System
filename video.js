// document.getElementById("ai").addEventListener("change", toggleAi)
// document.getElementById("fps").addEventListener("input", changeFps)

// const video = document.getElementById("video");
// const c1 = document.getElementById('c1');
// const ctx1 = c1.getContext('2d');
// var cameraAvailable = false;
// var aiEnabled = false;
// var fps = 16;

// var facingMode = "environment"; 
// var constraints = {
//     audio: false,
//     video: {
//         facingMode: 'enviroment'
//     }
// };

document.getElementById("ai").addEventListener("change", toggleAi);
document.getElementById("fps").addEventListener("input", changeFps);

const video = document.getElementById("video");
const c1 = document.getElementById('c1');
const ctx1 = c1.getContext('2d');
var cameraAvailable = false;
var aiEnabled = false;
var fps = 16;

var facingMode = "environment"; 
var constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
};

// Function to switch between front and rear cameras
function toggleCamera() {
  if (facingMode === "environment") {
    facingMode = "user";
  } else {
    facingMode = "environment";
  }
  
  // Update the constraints object with the new facingMode
  constraints.video.facingMode = facingMode;
  
  // Apply the updated constraints to the video stream
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(error) {
      console.error("Unable to switch camera: ", error);
    });
}

// Get the camera switch button element
var cameraSwitchBtn = document.querySelector("#cam23");

// Add a click event listener to the button that calls the toggleCamera() function
cameraSwitchBtn.addEventListener("click", toggleCamera);



function toggleCard(){
    let card = document.querySelector(".card-panel");
    card.classList.toggle('hide');
}

//switch camera with speech

// const recognition = new SpeechRecognition();
// recognition.lang = 'en-US';

// recognition.addEventListener('result', (event) => {
//   const transcript = event.results[0][0].transcript.toLowerCase();
//   if (transcript === 'switch') {
//     toggleCamera();
//   }
// });

// recognition.addEventListener('error', (event) => {
//   console.error('Speech recognition error:', event.error);
// });

// function startRecognition() {
//   recognition.start();
// }

// const speechBtn = document.getElementById('speech-btn');
// speechBtn.addEventListener('click', startRecognition);

//end of speech




/* Stream it to video element */
camera();
function camera() {
    if (!cameraAvailable) {
        console.log("camera")
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            cameraAvailable = true;
            video.srcObject = stream;
        }).catch(function (err) {
            cameraAvailable = false;
            if (modelIsLoaded) {
                if (err.name === "NotAllowedError") {
                    document.getElementById("loadingText").innerText = "Waiting for camera permission";
                }
            }
            setTimeout(camera, 1000);
        });
    }
}

window.onload = function () {
    timerCallback();
}

function timerCallback() {
    if (isReady()) {
        setResolution();
        ctx1.drawImage(video, 0, 0, c1.width, c1.height);
        if (aiEnabled) {
            ai();
        }
    }
    setTimeout(timerCallback, fps);
}

function isReady() {
    if (modelIsLoaded && cameraAvailable) {
        document.getElementById("loadingText").style.display = "none";
        document.getElementById("ai").disabled = false;
        return true;
    } else {
        return false;
    }
}

function setResolution() {
    if (window.screen.width < video.videoWidth) {
        c1.width = window.screen.width * 0.9;
        let factor = c1.width / video.videoWidth;
        c1.height = video.videoHeight * factor;
    } else if (window.screen.height < video.videoHeight) {
        c1.height = window.screen.height * 0.50;
        let factor = c1.height / video.videoHeight;
        c1.width = video.videoWidth * factor;
    }
    else {
        c1.width = video.videoWidth;
        c1.height = video.videoHeight;
    }
};

function toggleAi() {
    aiEnabled = document.getElementById("ai").checked;
}

function changeFps() {
    fps = 1000 / document.getElementById("fps").value;
}
let xaxis = document.getElementById("xaxis");
let yaxis = document.getElementById("yaxis");
let width = document.getElementById("width");
let height = document.getElementById("height");
let obj = document.getElementById("obj");
let speech = new SpeechSynthesisUtterance();
speech.pitch = 1;
speech.volume = 1;
speech.lang = "en-US";
speech.rate = 1;
// function ai() {
//     // Detect objects in the image element
//     objectDetector.detect(c1, (err, results) => {
//         console.log(results); 
//         for (let index = 0; index < results.length; index++) {
//             const element = results[index];
//             ctx1.font = "15px Arial";
//             ctx1.fillStyle = "red";
//             ctx1.fillText(element.label + " - " + (element.confidence * 100).toFixed(2) + "%", element.x + 10, element.y + 15);
//             ctx1.beginPath();
//             ctx1.strokeStyle = "red";
//             ctx1.rect(element.x, element.y, element.width, element.height);
//             ctx1.stroke();
//             console.log(element.label);
//             xaxis.textContent = element.x;
//             yaxis.textContent = element.y;
//             width.textContent = element.width;
//             height.textContent = element.height;
//             obj.textContent=element.label;
//         /*
//             var direction="";
//            if(element.x>44.74935531616211)
//             {
//                 direction="left";
//             }
//             else
//             {
//                 direction="right";
//             }
//         */
//             /* --------------- Speech ------------ */
//             speech.text = element.label;
//             speech.pitch = 1;
//             speech.volume = 1;
//             speech.lang = "en-US";
//             speech.rate = 1;
//             speechSynthesis.speak(speech);
//             /* --------------- Speech ------------ */
            
//         }
//     });
// }
const stopSpeech = () => {
    speechSynthesis.cancel();
}
function ai() {
    // Detect objects in the image element using the objectDetector library
    objectDetector.detect(c1, (err, results) => {
      console.log(results); 
  
      // Loop through the detected objects and display their information on a canvas
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
  
        // Display the label and confidence score of the object
        ctx1.font = "15px Arial";
        ctx1.fillStyle = "red";
        ctx1.fillText(element.label + " - " + (element.confidence * 100).toFixed(2) + "%", element.x + 10, element.y + 15);
  
        // Draw the bounding box of the object
        ctx1.beginPath();
        ctx1.strokeStyle = "red";
        ctx1.rect(element.x, element.y, element.width, element.height);
        ctx1.stroke();
  
        // Update the x-axis, y-axis, width, height, and object label information in some HTML elements
        xaxis.textContent = element.x;
        yaxis.textContent = element.y;
        width.textContent = element.width;
        height.textContent = element.height;
        obj.textContent = element.label;
  
        // Determine whether the object is on the left or right side of the canvas
        const canvasCenterX = c1.width / 2;
        const objectCenterX = element.x + element.width / 2;
        let position = "";
        if (objectCenterX < canvasCenterX) {
          position = "left";
        } 
        else if (objectCenterX == canvasCenterX) {
          position = "center";
        }
        else{
            position="right";
        }
        speech.text = `${element?.label} ${index+1} is on the ${position} side`;
        speechSynthesis.speak(speech);
      }
    });
  }

  //record screen

  const recordBtn = document.getElementById("recordBtn");
let recorder = null;
let chunks = [];

recordBtn.addEventListener("click", function() {
  if (recorder === null) {
    // Start recording
    chunks = [];
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(function(stream) {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });
        recorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };
        recorder.start();
        recordBtn.textContent = 'Stop';
      })
      .catch(function(error) {
        console.error("Unable to start screen recording: ", error);
      });
  } else {
    // Stop recording
    recorder.onstop = function() {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-record.webm';
      a.click();
      URL.revokeObjectURL(url);
    };
    recorder.stop();
    recorder = null;
    recordBtn.textContent = 'Record';
  }
});
  
