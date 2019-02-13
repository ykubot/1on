import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as routes from 'constants/routes';

import Footer from 'components/common/Footer';

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
                <HeroContainerStyle>
                    <HeroLeftContentStyle>
                        <HeroLogoStyle>
                            <img src='/assets/img/logo/icon-logo.png' alt='Icon Logo' />
                        </HeroLogoStyle>
                        <H1Style>
                            登録不要の1on1ビデオチャットサービス
                        </H1Style>
                        <HeroLinkStyle>
                            <span>{ window.location.href }</span>
                            <input
                                className="input" 
                                type="text" 
                                placeholder="ルームID"
                                value={roomId}
                                onChange={e => this.setState({ roomId: e.target.value })}
                            />
                            <Link to={routes.VIDEO_CHAT + '/' + roomId} className="button is-primary is-rounded">ビデオチャットを開始</Link>
                        </HeroLinkStyle>
                        <HeroDescriptionStyle>
                            <img src='/assets/img/hero-description.png' alt='What is the 1on?' />
                        </HeroDescriptionStyle>
                    </HeroLeftContentStyle>
                    <HeroRightContentStyle>
                        <img src='/assets/img/sample-image.png' alt='Sample' />
                    </HeroRightContentStyle>
                </HeroContainerStyle>
            </React.Fragment>
        );
    }
}

const HeroContainerStyle = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
	flex-direction: row;
    -webkit-box-pack: distribute;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
`

const HeroLeftContentStyle = styled.div`
    padding: 20px;
    max-width: 600px;
`

const HeroLogoStyle = styled.div`
    &>img {
        max-height: 50px;
    }
`

const H1Style = styled.h1`
    margin-top: 20px;
    padding: 5px 0;
    font-size: 28px;
    color: #323940;
`

const HeroLinkStyle = styled.div`
    margin: 40px 0;
    display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: #787979;
    &>span {
        margin: 5px;
    }
    &>input {
        width: 100px;
    }
    &>a {
        margin: 10px;
    }
`

const HeroDescriptionStyle = styled.div`
    max-width: 400px;
    margin: 50px 0;
`

const HeroRightContentStyle = styled.div`
    min-width: 400px;
    max-width: 500px;
    padding: 20px;
`

export default Hero;