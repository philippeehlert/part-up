import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouter from 'react-router-dom';
import { onStartup } from 'utils/Meteor';
import onRender from 'utils/onRender';

import Router from './components/Router';
import DashboardView from './views/Dashboard';
import HomeView from './views/Home';
import './index.css';

const dev = false;

if (dev) {
    onStartup(() => {
        onRender(() => {
            const root = document.getElementById('react-root');
            
            if (root) {
                ReactDOM.render(
                    <ReactRouter.BrowserRouter>
                        <ReactRouter.Switch>
                            <ReactRouter.Route path={'/home'} component={DashboardView}/>
                            <ReactRouter.Route exact component={HomeView}/>
                        </ReactRouter.Switch>
                    </ReactRouter.BrowserRouter>,
                    root as HTMLElement
              );
            }
        })
    });
} else {
    onStartup(() => {
        onRender(() => {
            const root = document.getElementById('react-dashboard-root');

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
}

