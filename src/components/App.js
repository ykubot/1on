import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

// Pages
import VideoChatPage from 'components/VideoChatPage';

// Layout Component
import Navigation from 'components/common/Navigation';
import Hero from 'components/common/Hero';

// Constants
import * as routes from '../constants/routes';

class App extends Component {

	componentDidMount() {
		console.log('App componentDidMount()');
	}

	render() {
		return (
			<Router>
				<React.Fragment>
					<HeroSectionStyle>
						<Navigation />
						<Switch>
							<Route exact path={routes.LP} component={() => <Hero />}/>
							<Route exact path={routes.VIDEO_CHAT_ROOM_ID} component={(props) => <VideoChatPage {...props} />}/>
						</Switch>
						<footer class="hero-footer">
							<a class="" href="#">button one</a>
							<a class="" href="#">button two</a>
						</footer>
					</HeroSectionStyle>
				</React.Fragment>
			</Router>
		);
	}
}

const HeroSectionStyle = styled.section`
	width: 100vw;
	height: auto;
	min-height: 100vh;
	background-color: #FBFCFC;
	display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
	flex-direction: column;
    -webkit-box-pack: space-between;
    -ms-flex-pack: space-between;
    justify-content: space-between;
	/* background-image: url("/assets/img/hero.png");
	background-position: center -100px;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
	background-color: #999; */
`

export default App;
