const socket = io("/");
const videoGrid = document.getElementById("videoGrid");
const noRemoteMsg = document.getElementById("noRemoteMsg");
const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001",
});

const myVideo = document.createElement("video");
myVideo.muted = true;
myVideo.setAttribute("data-label", "You");

let audiotoggle = true;
let videotoggle = true;

const peers = {};
let myId = null;

function updateMyLabel() {
    const label = myVideo.parentElement.querySelector('span');
    if (!myVideo.srcObject.getAudioTracks()[0].enabled && !myVideo.srcObject.getVideoTracks()[0].enabled) {
        label.textContent = 'You (Muted, Camera Off)';
    } else if (!myVideo.srcObject.getAudioTracks()[0].enabled) {
        label.textContent = 'You (Muted)';
    } else if (!myVideo.srcObject.getVideoTracks()[0].enabled) {
        label.textContent = 'You (Camera Off)';
    } else {
        label.textContent = 'You';
    }
}

function toggleAudio(state) {
    myVideo.srcObject.getAudioTracks()[0].enabled = state;
    updateMyLabel();
}
function toggleVideo(state) {
    myVideo.srcObject.getVideoTracks()[0].enabled = state;
    updateMyLabel();
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
    updateMyLabel();

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.setAttribute('data-label', 'Other Participant');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, 'Other Participant');
        });
    });

    socket.on('allUsers', userIds => {
        userIds.forEach(userId => {
            connectToNewUser(userId, stream);
        });
    });

    socket.on('userConnected', userId => {
        connectToNewUser(userId, stream);
    });

    const audioBtn = document.getElementById("audio");
    audioBtn.addEventListener("click", () => {
        audiotoggle = !audiotoggle;
        toggleAudio(audiotoggle);
        audioBtn.textContent = audiotoggle ? "Mute Audio" : "Unmute Audio";
        updateButtonColor(audioBtn, audiotoggle);
    });

    const cameraBtn = document.getElementById("camera");
    cameraBtn.addEventListener("click", () => {
        videotoggle = !videotoggle;
        toggleVideo(videotoggle);
        cameraBtn.textContent = videotoggle ? "Turn Off Camera" : "Turn On Camera";
        updateButtonColor(cameraBtn, videotoggle);
    });

    function updateButtonColor(button, state) {
        if (state) {
            button.style.backgroundColor = "lightblue";
        } else {
            button.style.backgroundColor = "lightblue";
        }
    }
})

myPeer.on('open', id => {
    myId = id;
    socket.emit('joinRoom', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    if (peers[userId]) return; // Prevent duplicate connections
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    video.setAttribute('data-label', 'Other Participant');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, 'Other Participant');
    });
    call.on('close', () => {
        video.parentElement && video.parentElement.remove();
        updateRemoteMsg();
    });
    peers[userId] = call;
}

socket.on('userDisconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
        delete peers[userId];
    }
});

function addVideoStream(video, stream, label = "Other Participant") {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    // Add label below video
    const wrapper = document.createElement('div');
    wrapper.className = 'video-frame';
    wrapper.style.width = '100%';
    wrapper.appendChild(video);
    const videoLabel = document.createElement('span');
    videoLabel.className = 'video-label';
    videoLabel.textContent = video.getAttribute('data-label') || label;
    wrapper.appendChild(videoLabel);
    videoGrid.append(wrapper);
    updateRemoteMsg();
}

const callTimer = document.getElementById("callTimer");
let timerInterval = null;
let callStarted = false;

function startCallTimer() {
    let seconds = 0;
    callTimer.textContent = '00:00';
    timerInterval = setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        callTimer.textContent = `${min}:${sec}`;
    }, 1000);
}
function stopCallTimer() {
    clearInterval(timerInterval);
    callTimer.textContent = '00:00';
}

function updateRemoteMsg() {
    // Show message if only one video (your own)
    if (videoGrid.childElementCount < 2) {
        noRemoteMsg.style.display = 'block';
        stopCallTimer();
        callStarted = false;
    } else {
        noRemoteMsg.style.display = 'none';
        if (!callStarted) {
            startCallTimer();
            callStarted = true;
        }
    }
}

const leaveBtn = document.getElementById('leave');
leaveBtn.addEventListener('click', () => {
    // Close all peer connections
    Object.values(peers).forEach(call => call.close());
    // Stop all local media tracks
    if (myVideo.srcObject) {
        myVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    // Optionally emit a leave event to the server if needed
    // socket.emit('leaveRoom', ROOM_ID, myId);
    window.close();
});

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Send chat message
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    socket.emit('chatMessage', { roomId: ROOM_ID, message: msg });
    appendMessage(msg, true);
    chatInput.value = '';
}

// Receive chat message
socket.on('chatMessage', ({ message }) => {
    appendMessage(message, false);
});

function appendMessage(msg, isSelf) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<span style='font-weight:bold;color:${isSelf ? '#2980b9' : '#16a085'};'>${isSelf ? 'You' : 'Other'}:</span> <span style='background:${isSelf ? '#eaf6ff' : '#e8f8f5'};padding:6px 12px;border-radius:16px;display:inline-block;max-width:80%;word-break:break-word;'>${msg}</span>`;
    msgDiv.style.margin = '8px 0';
    msgDiv.style.textAlign = isSelf ? 'right' : 'left';
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}