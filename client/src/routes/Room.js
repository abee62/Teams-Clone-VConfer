import React, {useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import './Room.css';
import Button from "@material-ui/core/Button"
import VideocamIcon from '@material-ui/icons/Videocam';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import ParticleBackground from "./ParticleBackground";
 
const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);
    const sendChannel = useRef();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
   

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => senders.current.push(peerRef.current.addTrack(track, userStream.current)));
        sendChannel.current = peerRef.current.createDataChannel("sendChannel");
        sendChannel.current.onmessage = handleReceiveMessage;
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        peerRef.current.ondatachannel = (event) =>{
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage;
        }
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => senders.current.push(peerRef.current.addTrack(track, userStream.current)));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
            screenTrack.onended = function() {
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
            }
        })
    }
    function renderMessage(message, index) {
        if (message.yours) {
            return (
                <div className ="MyRow" key={index}>
                    <div className="MyMessage">
                        {message.value}
                    </div>
                </div>
            )
        }

        return (
            <div className="PartnerRow" key={index}>
                <div className ="PartnerMessage">
                    {message.value}
                </div>
            </div>
        )
    }


    function handleReceiveMessage(e)
    {
        setMessages(messages => [...messages, {yours: false, value: e.data}]);
    }

    function sendMessage(){
        
        sendChannel.current.send(text);
        setMessages(messages => [...messages, {yours: true, value: text}]);
        setText("");
    }
    function handleChange(e) {
        setText(e.target.value);
    }

    function toggleVideo(){
		userStream.current.getVideoTracks()[0].enabled = !(userStream.current.getVideoTracks()[0].enabled)
        
	}

    function toggleAudio(){
		userStream.current.getAudioTracks()[0].enabled = !(userStream.current.getAudioTracks()[0].enabled)

	}

   

    return (
           
    <div className ="room">
         <ParticleBackground/> 
        <div className="heading">
        <h1>Welcome to VConfer!</h1>   
        
        
        <div className="buttons">
		<Button 
		startIcon={<VideocamIcon/>}
		variant="contained"
		color ="primary"
		onClick= {()=>toggleVideo()}>
		Video
		</Button>
		
		<Button 
		startIcon={<VolumeMuteIcon/>}
		variant="contained"
		color="secondary"
		onClick= {()=>toggleAudio()}>
		Audio
		</Button>
        <Button 
        variant="contained" 
        color="primary" 
        onClick={shareScreen}>
            Share screen
        </Button>

        </div>
        <div className="video">
            <div className ="v1"><video style={{height: 300}} playsInline muted autoPlay ref={userVideo} /></div>
            <div><video style={{height: 300}} autoPlay ref={partnerVideo} /></div>
        
        <div className="Container">
        <div className="Messages">
            {messages.map(renderMessage)}
        </div>
        <div className="Text">
        <textarea className="MessageBox" value={text} onChange={handleChange} placeholder="Type your text" />
        <Button variant="contained" color="primary" onClick={sendMessage}>Send</Button>
        </div>
        </div>
        
         </div>
         <h2>Share the website url to connect to another person!</h2>
        </div>
        
    </div>
    
    
    );
};

export default Room;