export default class Dispatcher {

    _listeners = {};
    _destroyed = false;

    /**
     * Subscribes a callback to an event
     * @public
     * @param {String} event
     * @param {Function} callback
     */
    subscribe(event: string, callback: Function) {
        if (this._destroyed) return;
        if (!this._listeners[event]) this._listeners[event] = [];

        this._listeners[event].push(callback);
    }

    /**
     * Unsubscribes a callback from an event
     * @public
     * @param {String} event
     * @param {Function} callback
     */
    unsubscribe(event: string, callback: Function) {
        if (this._listeners[event]) {
            const listenerIndex = this._listeners[event].indexOf(callback);

            if (listenerIndex > -1) this._listeners[event].splice(listenerIndex, 1);
        }
    }

    /**
     * Dispatch event and call all callbacks that are subscribed to it
     * @public
     * @param {String} event
     * @param {Object} event parameters
     */
    dispatch(event: string, parameters: Object = {}) {
        if (this._destroyed) return;
        if (this._listeners[event]) this._listeners[event].forEach((cb: Function) => cb({event, ...parameters}));
    }

    /**
     * Destroys the entire dispatcher and clears ALL event subscriptions
     * @public
     */
    destroy() {
        this._listeners = {};
        this._destroyed = true;
    }
}
