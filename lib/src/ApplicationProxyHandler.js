import * as _ from 'underscore';
export default class ApplicationProxyHandler {
    constructor(target = null) {
        this.target = null;
        this.target = target;
    }
    get(target, prop, receiver) {
        return prop in this.target ? _.property(prop)(this.target) : this.target.make(prop);
    }
    set(target, prop, value, receiver) {
        let tmp = {};
        Object.defineProperty(tmp, prop, {
            get() {
                return value;
            },
            enumerable: true
        });
        return prop in this.target ? (_.extend(this.target, tmp)) : this.target.instance(prop, value);
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
//# sourceMappingURL=ApplicationProxyHandler.js.map