import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

// Pages
import VideoChatPage from 'components/VideoChatPage';

// Layout Component
import Navigation from 'components/common/Navigation';
import Hero from 'components/common/Hero';
import Footer from 'components/common/Footer';

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
						<Switch>
							<Route exact path={routes.VIDEO_CHAT_ROOM_ID} component={() => <Navigation />}/>
						</Switch>
						<Switch>
							<Route exact path={routes.LP} component={() => <Hero />}/>
							<Route exact path={routes.VIDEO_CHAT_ROOM_ID} component={(props) => <VideoChatPage {...props} />}/>
						</Switch>
						<Switch>
							<Route exact path={routes.LP} component={() => <Footer />}/>
						</Switch>
						
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
	padding-bottom: 50px;
	background-color: #FBFCFC;
	display: -webkit-box;
    display: -ms-flexbox;
	display: flex;
	flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
	/* background-image: url("/assets/img/hero.png");
	background-position: center -100px;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
	background-color: #999; */
`

export default App;
