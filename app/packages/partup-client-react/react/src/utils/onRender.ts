export default function onRender(cb: Function) {
    requestAnimationFrame(() => {
        const element = document.querySelector('[data-react]');
        if (!element) {
            onRender(cb);
        } else {
            cb();
        }
    });
};