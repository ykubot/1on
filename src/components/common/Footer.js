import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => 
    <FooterStyle className="footer">
        <div className="container">
            <FooterContentStyle className="content">
                <FooterLinkArea>
                    <a href="https://goo.gl/forms/CzbwhSxK5IHbk7O73" target="_blank" rel="noopener noreferrer">フィードバックはこちら</a>
                </FooterLinkArea>
            </FooterContentStyle>
        </div>
    </FooterStyle>

const FooterStyle = styled.footer`
    width: 100%;
    bottom: 0;
    padding: 1rem 1.5rem 1rem;
    background-color: #FBFCFC;
`

const FooterContentStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    color: #FFFFFF;
    &>p {
        color: #FFFFFF;
        font-weight: 800;
    }
`

const FooterLinkArea = styled.div`
    &>a {
        margin: 10px;
        color: #707070;
    }
    &>a:hover {
        color: #45b2d3;
    }
`

export default Footer;
