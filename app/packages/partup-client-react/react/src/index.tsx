import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouter from 'react-router-dom';
import Router from './components/Router';
import DashboardView from './views/DashboardView';
import './index.css';

const checker = setInterval(() => {
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
    clearInterval(checker);
  }
}, 500);
