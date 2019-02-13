import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as routes from 'constants/routes';

const Navigation = () => 
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <HeaderStyle class="navbar-brand">
            <Link className="navbar-item" to={routes.LP}>
                <img src='/assets/img/logo/icon-logo.png' alt='Icon Logo' />
			</Link>
        </HeaderStyle>
    </nav>;

const HeaderStyle = styled.div`
    display: flex;
    align-items: center;
`

export default Navigation;
