const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

// 유저로부터 받은 스트림(오디오와 비디오가 결합된 상태)
let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    const cameras = devices.filter(device => device.kind === "videoinput");
    cameras.forEach(camera => {
      const option = document.getElementById("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    })
  } catch(e) {
    console.log(e);
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch(e) {
    console.log(e);
  }
}

getMedia();

function handleMuteClick() {
  myStream.getAudioTracks().forEach(track => {track.enabled = !track.enabled});
  if(!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  myStream.getVideoTracks().forEach(track => {track.enabled = !track.enabled});
  if(cameraOff) {
    cameraBtn.innerText = "Turn Off Camera";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn On Camera";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);