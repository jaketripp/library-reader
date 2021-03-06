const video = document.querySelector(".player");
var startButton = document.getElementById("start");
var error = document.getElementById("error");
const canvas = document.querySelector(".webcam");
const ctx = canvas.getContext("2d");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: { exact: "environment" } },
      // use for computer testing - no rear camera
      // video: true, 
      audio: false
    })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.log("Oh NO!", err);
      error.textContent = "Sorry, something went wrong! Reset your settings for this site and make sure you have your camera permissions enabled and have a working rear camera!"
    });
}

function paintToCanvas() {
  const { videoWidth: width, videoHeight: height } = video;

  var windowWidth = window.innerWidth;

  canvas.width = windowWidth ;
  canvas.height = windowWidth * (4 / 3);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  
  return setInterval(() => {

    fitVideoOn(canvas, video);
    // ctx.drawImage(video, 0, 0, video.videoHeight, video.videoWidth,     // source rectangle
    //                      0, 0, canvas.width, canvas.height); // destination rectangle
    

  }, 10);
}

var fitVideoOn = function (canvas, video) {
  var videoAspectRatio = video.videoWidth / video.videoHeight;
  var canvasAspectRatio = canvas.width / canvas.height;
  var renderableHeight, renderableWidth, xStart, yStart;

  // If image's aspect ratio is less than canvas's we fit on height
  // and place the image centrally along width
  if (videoAspectRatio < canvasAspectRatio) {
    renderableHeight = canvas.height;
    renderableWidth = video.videoWidth * (renderableHeight / video.videoHeight);
    xStart = (canvas.width - renderableWidth) / 2;
    yStart = 0;
  }

  // If image's aspect ratio is greater than canvas's we fit on width
  // and place the image centrally along height
  else if (videoAspectRatio > canvasAspectRatio) {
    renderableWidth = canvas.width
    renderableHeight = video.videoHeight * (renderableWidth / video.videoWidth);
    xStart = 0;
    yStart = (canvas.height - renderableHeight) / 2;
  }

  // Happy path - keep aspect ratio
  else {
    renderableHeight = canvas.height;
    renderableWidth = canvas.width;
    xStart = 0;
    yStart = 0;
  }
  ctx.drawImage(video, xStart, yStart, renderableWidth, renderableHeight);
};


startButton.addEventListener("click", function(e) {
  getVideo();
})

video.addEventListener("canplay", paintToCanvas);
