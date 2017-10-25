export default function onRender(cb: Function) {
    requestAnimationFrame(() => {
        // tslint:disable-next-line:no-console
        console.log('checking render');
        const element = document.getElementById('react-root');
        if (!element) {
            onRender(cb);
        } else {
            cb(element);
        }
    });
}
