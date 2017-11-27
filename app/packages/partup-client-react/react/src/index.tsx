'use strict';

declare global {
    interface Window {
        TAPi18n: any;
        i18next: any;
        Meteor: any;
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter,
    MemoryRouter,
} from 'react-router-dom';

import { onStartup } from 'utils/Meteor';
import { onRender } from 'utils/onRender';
import { routes, getCurrentIndex } from 'utils/router';

import { App } from './App';

import './index.css';

const dev = process.env.REACT_APP_DEV;

let Router: any = null;
if (dev) {
    Router = BrowserRouter;
} else {
    Router = MemoryRouter;
}

onStartup(() => {
    onRender((root: HTMLElement) => {
        ReactDOM.render(
            <Router
                initialEntries={routes}
                initialIndex={getCurrentIndex()}>
                <App />
            </Router>,
            root as HTMLElement,
        );
    });
});
