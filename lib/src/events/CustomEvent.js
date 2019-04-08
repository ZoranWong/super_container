"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomEvent extends Event {
    constructor(type, data) {
        super(type);
        this.data = null;
        this.data = data;
    }
}
exports.default = CustomEvent;
//# sourceMappingURL=CustomEvent.js.map