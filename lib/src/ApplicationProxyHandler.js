import * as _ from 'underscore';
import Application from "./Application";
import BrowserEventListenerAdapter from "./adapters/BrowserEventListenerAdapter";
export default class ApplicationProxyHandler {
    constructor(target = { rootId: 'id', component: null, adapter: null, dispatcher: BrowserEventListenerAdapter }) {
        this.target = null;
        this.proxy = null;
        this.target = new Application(target);
        this.proxy = new Proxy(this.target, this);
    }
    static getInstance(target = { rootId: 'id', component: null, adapter: null, dispatcher: BrowserEventListenerAdapter }) {
        if (!ApplicationProxyHandler.instance) {
            let instance = new ApplicationProxyHandler(target);
            ApplicationProxyHandler.instance = instance;
        }
        return ApplicationProxyHandler.instance.proxy;
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
ApplicationProxyHandler.instance = null;
//# sourceMappingURL=ApplicationProxyHandler.js.map