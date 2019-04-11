export default class BrowserEventListenerAdapter {
    addListener(event, listener) {
        document.addEventListener(event, listener);
    }
    dispatch(event) {
        document.dispatchEvent(event);
    }
    removeListener(event) {
        document.removeEventListener(event, null);
    }
}
//# sourceMappingURL=BrowserEventListenerAdapter.js.map