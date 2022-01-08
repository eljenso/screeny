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

    videoElem.srcObject = captureStream;

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

  videoElem.srcObject = null;
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
