const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

let captureStream = null

// Options for getDisplayMedia()

const displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function (evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function (evt) {
  stopCapture();
}, false);

async function startCapture(displayMediaOptions) {


  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    videoElem.srcObject = captureStream
  } catch (err) {
    console.error("Error: " + err);
  }

}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;

  console.log({ captureStream })

  captureStream = null
}
