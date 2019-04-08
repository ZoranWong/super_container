"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
class ApplicationProxyHandler {
    constructor(target = null) {
        this.target = null;
        this.target = target;
    }
    get(target, prop, receiver) {
        return prop in this.target ? _.property(prop)(this.target) : this.target.make(prop);
    }
    set(target, prop, value, receiver) {
        return this.target.instance(prop, value);
    }
    enumerate(target) {
        return this.target.keys();
    }
    has(target, p) {
        return this.target.has(p);
    }
    isExtensible(target) {
        return true;
    }
    ownKeys(target) {
        return _.keys(this.target || target);
    }
}
exports.default = ApplicationProxyHandler;
//# sourceMappingURL=ApplicationProxyHandler.js.map