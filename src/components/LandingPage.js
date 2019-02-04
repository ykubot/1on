import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as routes from '../constants/routes';

class LandingPage extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1>Landing Page</h1>
                    <Link to={routes.VIDEO_CHAT}>VideoChatPage</Link>
                    <a className="button is-primary is-rounded">Button</a>
                </div>
            </section>
        );
    }
} 

export default LandingPage;
