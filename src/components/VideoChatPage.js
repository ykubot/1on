import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Peer from 'skyway-js';

import MessageList from 'components/common/MessageList';

import * as routes from '../constants/routes';

const DUMMY_DATA = [
    {
        itsMe: false,
        text: 'Hello, its me.its me.its me.its me.its me.its me.'
    }, 
    {
        itsMe: true,
        text: 'Hello, Im KenjiIm KenjiIm KenjiIm KenjiIm KenjiIm KenjiIm Kenji'
    },
    
];

const INITIAL_STATE = {
    peerId: '',
    toPeerId: '',
    videoEnabled: true,
    audioEnabled: true,
    inputMessage: '',
    timelineMessages: DUMMY_DATA,
};

const peer = new Peer({
    key: process.env.REACT_APP_SKYWAY_API_KEY,
    debug: 3
});


class VideoChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this._localStream = '';
        this._localRoom = '';
        this._roomId = this.props.match.params.roomId;

        this.peerEventHandler();
    }

    async componentDidMount() {
        try {
            this.getUserMedia();
        } catch(err) {
            console.log('Get User Media failed.');
            console.log(err);
        }
    }

    async getUserMedia() {

        let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        console.log(stream);
        this._localStream = stream;

        this.joinRoom(this._localStream);

        let myVideo = document.getElementById("my-video");
        myVideo.srcObject = stream;
        myVideo.setAttribute('webkit-playsinline', true);
        myVideo.setAttribute('playsinline', true);
        myVideo.setAttribute('autoplay', true);
        myVideo.play();
    }

    /**
     * Join Room
     */
    joinRoom(stream) {
        if(!this._roomId) return;
        if (this._localRoom) {
            this._localRoom.replaceStream(stream);
            return;
        }
        this._localRoom = peer.joinRoom(this._roomId, {stream: stream});
        this.roomEventHandler(this._localRoom);
    }

    /**
     * Close Room
     */
    closeRoom() {
        if(!this._localRoom) return;
        this._localRoom.close();
    }

    /**
     * Event Handler about Peer
     */
    peerEventHandler() {
        if(!peer) return;

        peer.on('open', () => {
            this.setState({
                peerId: peer.id ? peer.id : '',
            });
        });

        peer.on('error', error => {
            console.log(error);
            alert(error.message);
        });
    }

    /**
     * Event Handler about Room
     */
    roomEventHandler(room) {
        console.log(room);
        if(!room) return;

        room.on('stream', stream => {
            console.log(stream);
            this.setState({
                toPeerId: stream.peerId ? stream.peerId : '',
            });

            let toVideo = document.getElementById("to-video");
            toVideo.srcObject = stream;
            toVideo.setAttribute('webkit-playsinline', true);
            toVideo.setAttribute('playsinline', true);
            toVideo.setAttribute('autoplay', true);
            toVideo.play();
        });
      
        room.on('removeStream', stream => {
            console.log(stream);
        });
      
        room.on('close', () => {
            console.log('Room Close');
            document.getElementById("to-video").remove()
        });

        room.on('peerLeave', peerId => {
            console.log("Peer id " + peerId + " is left");
            document.getElementById("to-video").remove();
        });

        room.on('data', message => {
            console.log(message);
            let result = this.state.timelineMessages;
            if (message.data) {
                let result = {
                    itsMe: false,
                    text: message.data,
                };
                this.setState({
                    timelineMessages: [...this.state.timelineMessages, result],
                });
            }
            // if (message.data instanceof ArrayBuffer) {
            //   const dataView = new Uint8Array(message.data);
            //   const dataBlob = new Blob([dataView]);
            //   const url = URL.createObjectURL(dataBlob);
            //   messages.append('<div><span class="file">' + message.src + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
            // } else {
            //     messages.append('<div><span class="peer">' + message.src + '</span>: ' + message.data + '</div>');
            // }
        });
    }

    /**
     * Leave from Room
     */
    onClickLeave = async (event) => {
        event.preventDefault();
        if(!this._localRoom) return;
        this._localRoom.close();
    }

    /**
     * Video ON/OFF
     */
    toggleVideoEnabled = (event) => {
        event.preventDefault();
        if (this._localStream) {
            let enabled = this.state.videoEnabled;
            this._localStream.getVideoTracks()[0].enabled = !enabled;
            this.setState({
                  videoEnabled: !enabled,
            });
        }
    }

    /**
     * Audio ON/OFF
     */
    toggleAudioEnabled = (event) => {
        event.preventDefault();
        if (this._localStream) {
            let enabled = this.state.audioEnabled;
            this._localStream.getAudioTracks()[0].enabled = !enabled;
            this.setState({
                  audioEnabled: !enabled,
            });
        }
    }

    onClickSend = (event, message) => {
        event.preventDefault();
        if (!message) return;

        if (this._localStream && this._localRoom) {
            console.log(message);
            this._localRoom.send(message);
            let result = {
                itsMe: true,
                text: message,
            };
            this.setState({
                inputMessage: '',
                timelineMessages: [...this.state.timelineMessages, result],
            });
        }
    }

    render() {
        const {
            peerId,
            toPeerId,
            inputMessage,
            timelineMessages,
        } = this.state;

        const isDisable = inputMessage ? false : true;

        return (
            <React.Fragment>
                <ContainerStyle>
                    <VideoAreaStyle>
                        <VideoAreaHeaderStyle>
                            <CopyLinkStyle>
                                <span>{ window.location.href }</span>
                                <Link to={routes.VIDEO_CHAT + '/' + this._roomId} className="button is-primary is-rounded">Copy</Link>
                            </CopyLinkStyle>
                        </VideoAreaHeaderStyle>

                        <VideoContentStyle>
                            <MyVideoAreaStyle>
                                <MyVideoViewStyle>
                                    <video id="my-video"></video>
                                </MyVideoViewStyle>
                            </MyVideoAreaStyle>
                            <OpponentVideoAreaStyle>
                                <OpponentVideoViewStyle>
                                    {/* <video id="to-video"></video> */}
                                    <img id="to-video" src='/assets/img/webinar-3199164_1920.jpg' alt='no video' />
                                </OpponentVideoViewStyle>
                                <VideoControlAreaStyle>
                                    <i className='uil uil-video' onClick={ event => this.toggleVideoEnabled(event) }></i>
                                    <i className='uil uil-microphone' onClick={ event => this.toggleAudioEnabled(event) }></i>
                                    <i className='uil uil-exit' onClick={ event => this.onClickLeave(event) }></i>
                                </VideoControlAreaStyle>
                            </OpponentVideoAreaStyle>
                        </VideoContentStyle>
                    </VideoAreaStyle>

                    <ChatAreaStyle>
                        <ChatTimelineStyle>
                            <ChatTimelineContent>
                                <MessageList messages={timelineMessages} />
                            </ChatTimelineContent>
                        </ChatTimelineStyle>
                        <ChatInputAreaStyle>
                            <input
                                className="input" 
                                type="text" 
                                placeholder="Message"
                                value={inputMessage}
                                onChange={e => this.setState({ inputMessage: e.target.value })}
                            />
                            <i 
                                className='uil uil-message'
                                disabled={isDisable}
                                onClick={ event => this.onClickSend(event, inputMessage) }
                            ></i>
                        </ChatInputAreaStyle>
                    </ChatAreaStyle>
                </ContainerStyle>
            </React.Fragment>
        );
    }
}

const ContainerStyle = styled.section`
    position: relative;
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
`

const VideoAreaStyle = styled.div`
    /* position: relative; */
    /* background-color: #FBFCFC; */
    /* background-image: url('/assets/img/background.png'); */
    /* height: 100%; */
    width: 100%;    
    display: flex;
    flex-direction: column;
`

const VideoAreaHeaderStyle = styled.div`
    padding: 10px 20px;
    width: 100%;
    height: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
    
`

const CopyLinkStyle = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: #787979;
    &>span {
        margin: 5px;
    }
    &>a {
        margin: 10px;
    }
`

const VideoContentStyle = styled.div`
    height: 100%;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
`

const MyVideoAreaStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    padding: 10px;
`


const MyVideoViewStyle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    &>video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    &>img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
`

const OpponentVideoAreaStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 10px;
`

const OpponentVideoViewStyle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    &>video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    &>img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
`

const VideoControlAreaStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    &>i {
        padding: 5px;
        margin: 5px;
        border-radius: 50%;
        /* background-color: grey; */
        font-size: 25px;
    }
`

const ChatAreaStyle = styled.div`
    background-color: #FFFFFF;
    height: 100%;
    width: 25%;
    min-width: 200px;
    margin-left: auto;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
`

const ChatTimelineStyle = styled.div`
    height: calc(100vh - 108px);
    display: flex;
    flex-direction: column;
`

const ChatTimelineContent = styled.div`
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
`

const ChatInputAreaStyle = styled.div`
    margin-top: auto;
    display: flex;
    align-items: center;
    padding: 10px 5px;
    &>i {
        width: 30px;
        font-size: 20px;
        cursor: pointer;
    }
`


export default VideoChatPage;
