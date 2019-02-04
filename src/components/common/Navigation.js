import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as routes from 'constants/routes';

const Navigation = () => 
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Link className="navbar-item" to={routes.LP}>
				1on
			</Link>
        </div>
    </nav>;


export default Navigation;
