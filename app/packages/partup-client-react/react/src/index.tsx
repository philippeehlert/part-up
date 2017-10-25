import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Switch,
    Route,
    MemoryRouter,
} from 'react-router-dom';
import { onStartup } from 'utils/Meteor';
import onRender from 'utils/onRender';

import Router from './components/Router';
import DashboardView from './views/Dashboard';
import HomeView from './views/Home';
import './index.css';

if (process.env.REACT_APP_DEV) {
    onStartup(() => {
        onRender(() => {
            const root = document.getElementById('react-root');

            if (root) {
                ReactDOM.render(
                    <BrowserRouter>
                        <Switch>
                            <Route path={'/home'} component={DashboardView}/>
                            <Route exact component={HomeView}/>
                        </Switch>
                    </BrowserRouter>,
                    root as HTMLElement,
              );
            }
        });
    });
} else {
    onStartup(() => {
        onRender(() => {
            const root = document.getElementById('react-dashboard-root');

            if (root) {
              ReactDOM.render(
                  <MemoryRouter>
                      <Router>
                          <DashboardView />
                      </Router>
                  </MemoryRouter>,
                  root as HTMLElement,
              );
            }
        });
    });
}
