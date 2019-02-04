import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as routes from 'constants/routes';

const INITIAL_STATE = {
    roomId: '',
};

class Hero extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        this.setRandomRoomId();
    }

    setRandomRoomId = () => {
        const len = 8;
        const words = "abcdefghijklmnopqrstuvwxyz0123456789";
        let roomId = "";
        for(let i = 0; i < 8; i++){
            roomId += words[Math.floor(Math.random() * words.length)];
        }
        this.setState({roomId: roomId});
    }

    render() {
        const {
            roomId,
        } = this.state;

        return(
            <React.Fragment>
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">
                            ログイン不要のビデオチャットサービス
                        </h1>
                        <h2 className="subtitle">
                            リンクをシェアしてビデオチャットを開始しよう
                        </h2>
                        <Link to={routes.VIDEO_CHAT + '/' + roomId}>{ window.location.href + roomId}</Link>
                        <a className="button is-primary is-rounded">Button</a>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Hero;