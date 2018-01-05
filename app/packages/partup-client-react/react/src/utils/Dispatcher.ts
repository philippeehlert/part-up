export class Dispatcher {

    private listeners = {};
    private destroyed = false;

    /**
     * Subscribes a callback to an event
     * @public
     * @param {String} event
     * @param {Function} callback
     */
    public subscribe(event: string, callback: Function) {
        if (this.destroyed) return;
        if (!this.listeners[event]) this.listeners[event] = [];

        this.listeners[event].push(callback);
    }

    /**
     * Unsubscribes a callback from an event
     * @public
     * @param {String} event
     * @param {Function} callback
     */
    public unsubscribe(event: string, callback: Function) {
        if (this.listeners[event]) {
            const listenerIndex = this.listeners[event].indexOf(callback);

            if (listenerIndex > -1) this.listeners[event].splice(listenerIndex, 1);
        }
    }

    /**
     * Dispatch event and call all callbacks that are subscribed to it
     * @public
     * @param {String} event
     * @param {Object} event parameters
     */
    public dispatch(event: string, parameters: Object = {}) {
        if (this.destroyed) return;
        if (this.listeners[event]) this.listeners[event].forEach((cb: Function) => cb({ event, ...parameters }));
    }

    /**
     * Destroys the entire dispatcher and clears ALL event subscriptions
     * @public
     */
    public destroy() {
        this.listeners = {};
        this.destroyed = true;
    }
}
