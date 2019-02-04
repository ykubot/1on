import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Peer from 'skyway-js';

import * as routes from '../constants/routes';

const peer = new Peer({
    key: process.env.REACT_APP_SKYWAY_API_KEY,
    debug: 3
});


class VideoChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            peerId: '',
            toPeerId: '',
            videoEnabled: true,
            audioEnabled: true,
        };

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

    render() {
        const {
            peerId,
            toPeerId,
        } = this.state;

        return (
            <React.Fragment>
                <ContainerStyle>
                    <VideoAreaStyle>
                        <VideoAreaHeaderStyle>
                            <div>
                                Room ID: { this._roomId }
                            </div>
                        </VideoAreaHeaderStyle>

                        <VideoContentStyle>
                            <MyVideoAreaStyle>
                                <MyVideoHeaderStyle>
                                    My Peer ID: { peerId }
                                </MyVideoHeaderStyle>
                                <MyVideoViewStyle>
                                    <video id="my-video"></video>
                                </MyVideoViewStyle>
                            </MyVideoAreaStyle>
                            <OpponentVideoAreaStyle>
                                <OpponentVideoHeaderStyle>
                                    To Peer ID: { toPeerId }
                                </OpponentVideoHeaderStyle>
                                <OpponentVideoViewStyle>
                                    {/* <video id="to-video"></video> */}
                                    <img src='/assets/img/webinar-3199164_1920.jpg' alt='no video' />
                                </OpponentVideoViewStyle>
                                <VideoControlAreaStyle>
                                    <div>
                                        <button className="button" onClick={ event => this.onClickLeave(event) }>Leave from Room</button>
                                    </div>
                                    <div>
                                        <button onClick={ event => this.toggleVideoEnabled(event) }>Video ON/Off</button>
                                    </div>
                                    <div>
                                        <button onClick={ event => this.toggleAudioEnabled(event) }>Audio ON/Off</button>
                                    </div>
                                </VideoControlAreaStyle>
                            </OpponentVideoAreaStyle>
                        </VideoContentStyle>
                    </VideoAreaStyle>

                    <ChatAreaStyle>
                        <ChatTimelineStyle>
                            Chat Timeline
                        </ChatTimelineStyle>
                        <ChatInputAreaStyle>
                            <input></input>
                            <button>Send</button>
                        </ChatInputAreaStyle>
                    </ChatAreaStyle>
                </ContainerStyle>
            </React.Fragment>
        );
    }
}

const ContainerStyle = styled.section`
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const VideoAreaStyle = styled.div`
    background-color: #F4F8F8;
    height: 100%;
    width: 100%;    
`

const VideoAreaHeaderStyle = styled.div`
    width: 100%;
    height: 50px;
`

const VideoContentStyle = styled.div`
    position: relative;
    height: auto;
    min-height: 100%;
    display: flex;
    flex-direction: row;
`

const MyVideoAreaStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    padding: 10px;
`

const MyVideoHeaderStyle = styled.div`
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
    }
    &>img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const OpponentVideoAreaStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 10px;
`

const OpponentVideoHeaderStyle = styled.div`
    width: 100%;
`

const OpponentVideoViewStyle = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    &>video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &>img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const VideoControlAreaStyle = styled.div`
    width: 150px;
`

const ChatAreaStyle = styled.div`
    background-color: #E3EDEF;
    height: 100%;
    min-width: 300px;
    margin-left: auto;
`

const ChatTimelineStyle = styled.div``

const ChatInputAreaStyle = styled.div``


export default VideoChatPage;
