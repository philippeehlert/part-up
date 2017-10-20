'use strict';

import React from 'react';
import { Template } from 'meteor/templating';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Router from '../components/Router';
import DashboardView from '../views/DashboardView';

Template.ReactDashboard.onRendered(() => {
    render(
        <MemoryRouter>
            <Router>
                <DashboardView />
            </Router>
        </MemoryRouter>,
        document.getElementById('react-dashboard')
    );
});
