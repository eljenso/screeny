let captureStream = null;
// const recordedChunks = [];

// Set event listeners for the start and stop buttons
const startElem = document.getElementById("start");
startElem.addEventListener("click", () => {
  startCapture();
});

const stopElem = document.getElementById("stop");
stopElem.addEventListener("click", () => {
  stopCapture();
});

const videoElem = document.getElementById("video");

async function startCapture() {
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      // TODO: Check options
      video: {
        cursor: "always",
      },
      audio: false,
    });

    videoElem.srcObject = captureStream;

    // Record the screen/window the user selected
    const mediaRecorder = new MediaRecorder(captureStream, {
      mimeType: "video/webm",
    });
    // Will be called once the user stops the recording
    mediaRecorder.ondataavailable = (event) => {
      download(event.data);
    };

    mediaRecorder.start();
  } catch (err) {
    console.error("Error: " + err);
  }
}

function stopCapture() {
  let tracks = videoElem.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  //
  videoElem.srcObject = null;
  captureStream = null;
}

function download(recordedChunk) {
  // FIXME: Add date to filename
  const filename = "test.webm";

  const blob = new Blob([recordedChunk], {
    type: "video/webm",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}
