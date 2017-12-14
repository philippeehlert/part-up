'use strict';

declare global {
    interface Window {
        TAPi18n: any;
        i18next: any;
        Meteor: any;
        RENDER_REACT: any;
        UNRENDER_REACT: any;
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter,
    MemoryRouter,
} from 'react-router-dom';

import { onStartup } from 'utils/Meteor';
import { routes, getCurrentIndex } from 'utils/router';

import { App, renderInstanceType } from './App';

import './index.css';

const dev = process.env.REACT_APP_DEV;

let Router: any = null;
if (dev) {
    Router = BrowserRouter;
} else {
    Router = MemoryRouter;
}

window.RENDER_REACT = (rootEl: string, instance: renderInstanceType) => {
    const root = document.getElementById(rootEl);

    if (!root) return;

    window.console.log(rootEl, instance);

    onStartup(() => {
        ReactDOM.render(
            <Router
                initialEntries={routes}
                initialIndex={getCurrentIndex()}>
                <App render={instance} />
            </Router>,
            root,
        );
    });
};

window.UNRENDER_REACT = (rootEl: string) => {
    const root = document.getElementById(rootEl);

    if (!root) return;

    ReactDOM.unmountComponentAtNode(root);
};

if (dev) {
    onStartup(() => {
        window.RENDER_REACT('react-root', 'home');
    });
}
