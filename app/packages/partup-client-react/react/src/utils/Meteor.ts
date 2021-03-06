export const { default: Meteor } = require('react-web-meteor');

interface MeteorDocument {
    _id: string;
}

export interface MeteorCollection {
    find(selector: Object, options: Object): MeteorDocument[];
    findOne(selector: Object, options: Object): MeteorDocument | undefined;
}

const callbackQueue: Array<any> = [];
let isLoadingCompleted = false;
let isReady = false;

const maybeReady = () => {
    if (isReady || !isLoadingCompleted) return;

    isReady = true;

    // Run startup callbacks
    while (callbackQueue.length) {
        (callbackQueue.shift())();
    }
};

const loadingCompleted = () => {
    if (!isLoadingCompleted) {
        isLoadingCompleted = true;
        maybeReady();
    }
};

if (document.readyState === 'complete' || document.readyState === 'loaded') {
    // Loading has completed,
    // but allow other scripts the opportunity to hold ready
    window.setTimeout(loadingCompleted);
} else { // Attach event listeners to wait for loading to complete
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', loadingCompleted, false);
        window.addEventListener('load', loadingCompleted, false);
    } else { // Use IE event model for < IE9
        const ieEvent = 'attachEvent';
        document[ieEvent]('onreadystatechange', () => {
            if (document.readyState === 'complete') {
                loadingCompleted();
            }
        });
        window[ieEvent]('load', loadingCompleted);
    }
}

export function onStartup(callback: Function) {
    const ieEvent = 'doScroll';
    // Fix for < IE9, see http://javascript.nwbox.com/IEContentLoaded/
    const doScroll = !document.addEventListener && document.documentElement[ieEvent];

    if (!doScroll || window !== top) {
        if (isReady) {
            callback();
        } else {
            callbackQueue.push(callback);
        }
    } else {
        try {
            doScroll('left');
        } catch (error) {
            setTimeout(() => {
                Meteor.startup(callback);
            }, 50);
            return;
        }
        callback();
    }
}

onStartup(() => {
    if (process.env.REACT_APP_DEV) {
        Meteor.connect('ws://localhost:3000/websocket');
    } else {
        const { protocol, host } = window.location;

        Meteor.connect(`${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/websocket`);
    }

    loginWithMeteorToken();
});

export function loginWithMeteorToken() {
    Meteor._loginWithToken(getLoginToken());
}

export function getLoginToken() {
    if (process.env.REACT_APP_DEV) {
        return window.localStorage.getItem('reactnativemeteor_usertoken');
    }

    return window.localStorage.getItem('Meteor.loginToken');
}

export function onLogin(cb: Function) {

    if (Meteor.user()) return cb();

    Meteor.Accounts.onLogin(cb);
}

export function onLogout() {
    window.localStorage.removeItem('reactnativemeteor_usertoken')
}

export function onLoginFailure(cb: Function) {
    Meteor.Accounts.onLoginFailure(cb);
}
