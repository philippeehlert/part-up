import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouter from 'react-router-dom';
import Meteor from 'utils/Meteor';
import onRender from 'utils/onRender';

import Router from './components/Router';
import DashboardView from './views/DashboardView';
import './index.css';

Meteor.startup(() => {
    onRender(() => {
        const root = document.getElementById('react-root');
        
        if (root) {
          ReactDOM.render(
              <ReactRouter.MemoryRouter>
                  <Router>
                      <DashboardView />
                  </Router>
              </ReactRouter.MemoryRouter>,
              root as HTMLElement
          );
        }
    })
});
