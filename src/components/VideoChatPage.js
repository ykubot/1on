import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import media from "styled-media-query";

import Peer from 'skyway-js';

import MessageList from 'components/common/MessageList';

import * as routes from '../constants/routes';

const DUMMY_DATA = [
    {
        itsMe: false,
        text: 'Hi, Kenji. '
    }, 
    {
        itsMe: true,
        text: 'Hi, Ray.'
    },
    {
        itsMe: false,
        text: 'How are you today?'
    },
];

const INITIAL_STATE = {
    peerId: '',
    toPeerId: '',
    isCopied: false,
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
        this._roomUrl = React.createRef();

        this.peerEventHandler();
    }

    async componentDidMount() {
        try {
            this.getUserMedia();
            this.retryGetUserMedia();
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

    retryGetUserMedia() {
        if(this._localStream) return;
        setTimeout(
            function() {
                console.log('retry');
                this.getUserMedia();
            }
            .bind(this),
            3000
        );
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
        this.setState({
            toPeerId: '',
        });
    }

    /**
     * Copy to Clickboard
     */
    copyToClickboard = (event) => {
        event.preventDefault();
        if(!this._roomUrl) return;
        this.setState({ isCopied: true });
        console.log(this._roomUrl);
        this._roomUrl.current.select();
        document.execCommand("copy");
        setTimeout(
            function() {
                this.setState({isCopied: false});
            }
            .bind(this),
            2000
        );
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
            console.log('Peer ID: ', peer.id);
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
        // console.log(room);
        if(!room) return;

        room.on('stream', stream => {
            console.log(stream);
            if(!stream) return;
            console.log('To Peer ID: ', stream.peerId);
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
            if(!document.getElementById("to-video")) return;
            document.getElementById("to-video").remove()
        });

        room.on('peerLeave', peerId => {
            console.log("Peer id " + peerId + " is left");
            if(!document.getElementById("to-video")) return;
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
            isCopied,
            videoEnabled,
            audioEnabled,
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
                                <input
                                    className="input"  
                                    type='text' 
                                    ref={ this._roomUrl } 
                                    value={ window.location.href }
                                    
                                    >
                                </input>
                                <Link 
                                    to={routes.VIDEO_CHAT + '/' + this._roomId} 
                                    className="button is-primary is-rounded"
                                    onClick={ event => this.copyToClickboard(event) }
                                >{ isCopied ? 'Copied!': 'Copy' }</Link>
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
                                    <video id="to-video" poster='https://source.unsplash.com/random/800x600' alt={toPeerId} ></video>
                                </OpponentVideoViewStyle>
                                <VideoControlAreaStyle>
                                    <ControlIcon className={ videoEnabled ? 'uil uil-video' : 'uil uil-video-slash'} enabled={videoEnabled} onClick={ event => this.toggleVideoEnabled(event) }></ControlIcon>
                                    <ControlIcon className={ audioEnabled ? 'uil uil-microphone' : 'uil uil-microphone-slash'} enabled={audioEnabled} onClick={ event => this.toggleAudioEnabled(event) }></ControlIcon>
                                    <ControlIcon className='uil uil-exit' enabled={toPeerId ? true : false} onClick={ event => this.onClickLeave(event) }></ControlIcon>
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;

    ${media.lessThan("small")`
        flex-direction: column;
    `}
`

const VideoAreaStyle = styled.div`
    /* position: relative; */
    /* background-color: #FBFCFC; */
    /* background-image: url('/assets/img/background.png'); */
    /* height: 100%; */
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
`

const VideoAreaHeaderStyle = styled.div`
    padding: 10px 20px;
    width: 100%;
    height: 60px;
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
    border-bottom: 1px solid #EDEEEF;
`

const CopyLinkStyle = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
    align-items: center;
    color: #787979;
    &>input {
        width: 260px;
        margin: 5px;
        background-color: #FBFCFC;
        border: none;
        color: #787979;
        box-shadow: none;
        cursor: default;

        ${media.lessThan("small")`
            width: 230px;
            font-size: 12px;        
        `}
    }
    &>a {
        width: 80px;
        margin: 10px;
    }

    
`

const VideoContentStyle = styled.div`
    height: 100%;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: flex-start;

    ${media.lessThan("large")`
        flex-direction: column;
    `}
`

const MyVideoAreaStyle = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 300px;
    padding: 10px;

    ${media.between("small", "large")`
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 1001;
    `}

    ${media.lessThan("small")`
        position: absolute;
        min-width: 150px;
        padding: 0;
        top: 0px;
        left: 0px;
        z-index: 1001;
    `}
`

const MyVideoViewStyle = styled.div`
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 10px;
`

const OpponentVideoViewStyle = styled.div`
    position: relative;
    min-width: 600px;
    max-height: 70vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 10px 0;
    &>video {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    &>img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    ${media.lessThan("small")`
        width: 100%;
        min-width: none;
        max-height: none;
    `}
`

const VideoControlAreaStyle = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    border-radius: 290486px;
    background: rgba(50, 57, 64, 0.75);
    z-index: 1001;
    &>i {
        padding: 5px;
        margin: 5px;
        border-radius: 50%;
        font-size: 25px;
        cursor: pointer;
    }

    ${media.lessThan("small")`
        position: absolute;
        bottom: 0;
    `}
`

const ControlIcon = styled.i`
    color: ${props => props.enabled ? '#45b2d3' : '#4a4a4a'};
`

const ChatAreaStyle = styled.div`
    background-color: #FFFFFF;
    height: 100%;
    width: 25%;
    min-width: 200px;
    margin-left: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #EDEEEF;

    ${media.lessThan("small")`
        width: 100%;        
    `}
`

const ChatTimelineStyle = styled.div`
    height: calc(100vh - 108px);
    display: -webkit-box;
    display: -ms-flexbox;
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 5px;
    &>i {
        width: 30px;
        font-size: 20px;
        cursor: pointer;
    }
`


export default VideoChatPage;
