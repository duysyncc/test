var socket = io.connect('https://socketioduysy.herokuapp.com/');
var idRobotcontrol = document.getElementById("idVideocallRobot").textContent;
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random() * 1000000000);
var servers = {
    'iceServers': [
        {
            'urls': 'stun:relay.backups.cz'
        },
        {
            url: 'turn:relay.backups.cz',
            credential: 'webrtc',
            username: 'webrtc'
        },
        {
            url: 'turn:relay.backups.cz?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        }
    ]
};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate ? sendMessage(yourId, JSON.stringify({
    'ice': event.candidate
})) : console.log("Sent All Ice"));
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
    socket.emit('connectwebrtc', {
        idRobotcontrol: idRobotcontrol,
        data: {
            sender: senderId,
            message: data
        }
    });
    // console.log("sendMessage" + JSON.stringify(data));
}

function readMessage(data) {
    var msg = JSON.parse(data.message);
    console.log(data);
    var sender = data.sender;
    if (sender != yourId) {
        if (msg.ice != undefined) {
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type == "offer") {
            // var r = confirm("Answer call?");
            var r = true;
            if (r == true) {
                pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                    .then(() => pc.createAnswer())
                    .then(answer => pc.setLocalDescription(answer))
                    .then(() => sendMessage(yourId, JSON.stringify({
                        'sdp': pc.localDescription
                    })));
            } else {
                alert("Rejected the call");
            }
        } else if (msg.sdp.type == "answer") {
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
    }
};
socket.on(idRobotcontrol, readMessage);

function showMyFace() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video:true
        // video: {
        //     facingMode: "environment"
        // }
        
    })
        .then(stream => yourVideo.srcObject = stream)
        .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
    console.log("calling")
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => sendMessage(yourId, JSON.stringify({
            'sdp': pc.localDescription
        })));
}