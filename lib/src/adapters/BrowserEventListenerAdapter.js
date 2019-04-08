"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserEventListenerAdapter {
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
exports.default = BrowserEventListenerAdapter;
//# sourceMappingURL=BrowserEventListenerAdapter.js.map