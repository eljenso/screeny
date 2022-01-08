// Set event listeners for the start and stop buttons
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  startCapture();
});

const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", () => {
  stopCapture();
});

const videoElement = document.getElementById("video");

let captureStream = null;

async function startCapture() {
  try {
    //
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      // TODO: Check options
      video: {
        cursor: "always",
      },
      audio: false,
    });

    videoElement.srcObject = captureStream;

    // Record the screen/window the user selected
    const mediaRecorder = new MediaRecorder(captureStream, {
      mimeType: "video/webm",
    });
    mediaRecorder.start();

    // Providing the recording as download to user
    // Will be called once the user stops the recording
    mediaRecorder.ondataavailable = (event) => download(event.data);
  } catch (err) {
    console.error("Error: " + err);
  }
}

// FIXME: check for user stopping recording without using this button
function stopCapture() {
  // Stop the capture (will indirectly trigger ondataavailable of MediaRecorder)
  captureStream.getTracks().map((track) => track.stop());

  videoElement.srcObject = null;
  captureStream = null;
}

function download(recordedChunk) {
  // FIXME: Add date to filename
  const filename = "test.webm";

  const url = URL.createObjectURL(
    new Blob([recordedChunk], {
      type: "video/webm",
    })
  );

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}
