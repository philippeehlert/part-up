export const routes = [
    '/home',
    '/discover',
    '/profile',
    '/login',
    '/oauth',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/unsubscribe-email-all',
    '/unsubscribe-email-one',
    '/register',
    '/partups',
    '/close',
    '/admin',
    '/about',
    '/pricing',
    '/tribes',
    '/chats',
    '/',
];

let callbacks: any = [];

let currentLocationIndex = 0;

const setCurrentIndex = (pathname: string = window.location.pathname) => {
    for (let i = 0; i < routes.length; i++) {
        if (pathname.startsWith(routes[i])) {
            currentLocationIndex = i;
            break;
        }
    }
};

setCurrentIndex();

(function(history: any) {
    var pushState = history.pushState;
    history.pushState = function(state: any) {
        // tslint:disable-next-line:quotemark
        if (typeof history.onpushstate === "function") {
            history.onpushstate({state: state});
        }
        setCurrentIndex(arguments[2]);
        callbacks.forEach((cb: Function) => {
            cb(routes[getCurrentIndex()]);
        });
        return pushState.apply(history, arguments);
    };
})(window.history);

export function onRouteChange(cb: Function) {
    callbacks.push(cb);
}

export function getCurrentIndex() {
    return currentLocationIndex;
}