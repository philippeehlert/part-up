export function onRender(cb: Function) {
    // wait for blaze to render the react-root div
    requestAnimationFrame(() => {
        const element = document.getElementById('react-root');
        if (!element) {
            onRender(cb);
        } else {
            cb(element);
        }
    });
}
