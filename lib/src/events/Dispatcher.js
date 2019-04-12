export default class Dispatcher {
    constructor(dispatcher) {
        this.dispatcher = null;
        this.dispatcher = new dispatcher();
    }
    dispatch(event) {
        this.dispatcher.dispatch(event);
    }
    addListener(event, listener) {
        this.dispatcher.addListener(event, listener);
    }
    removeListener(event) {
        this.dispatcher.removeListener(event);
    }
}
//# sourceMappingURL=Dispatcher.js.map