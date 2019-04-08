"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const helper_1 = require("../utils/helper");
const ContextualBindingBuilder_1 = require("./ContextualBindingBuilder");
class Container {
    constructor() {
        this.instances = null;
        this.aliases = null;
        this.abstractAliases = null;
        this.extenders = null;
        this.tags = null;
        this.buildStack = null;
        this.with = null;
        this.contextual = null;
        this.reboundCallbacks = null;
        this.bindings = null;
        this.globalResolvingCallbacks = null;
        this.globalAfterResolvingCallbacks = null;
        this.resolvingCallbacks = null;
        this.afterResolvingCallbacks = null;
        this.resolved = null;
        this.instances = new Map();
        this.aliases = new Map();
        this.abstractAliases = new Map();
        this.extenders = new Map();
        this.bindings = new Map();
        this.resolved = new Set();
        this.with = new Set();
        this.reboundCallbacks = new Map();
        this.globalResolvingCallbacks = new Set();
        this.resolvingCallbacks = new Map();
        this.afterResolvingCallbacks = new Map();
        this.globalAfterResolvingCallbacks = new Set();
        this.contextual = new Map();
        this.buildStack = new Set();
    }
    when(concrete) {
        return new ContextualBindingBuilder_1.default(this, this.getAlias(concrete));
    }
    bound(abstractName) {
        return this.bindings.get(abstractName) ||
            this.instances.get(abstractName) ||
            this.isAlias(abstractName);
    }
    getBindings() {
        return this.bindings;
    }
    isShared(abstractName) {
        let bind = null;
        return this.instances.get(abstractName) ||
            ((bind = this.bindings.get(abstractName))
                && !!bind['shared']);
    }
    isAlias(abstractName) {
        return !!this.aliases.get(abstractName);
    }
    isEmpty() {
        return this.instances.size === 0;
    }
    size() {
        return this.instances.size;
    }
    alias(abstractName, alias) {
        this.aliases.set(alias, abstractName);
        let set = this.abstractAliases.get(abstractName) || new Set();
        set.add(alias);
        this.abstractAliases.set(abstractName, set);
    }
    addContextualBinding(concrete, abstractName, implementation) {
        let tmp = this.contextual.get(concrete) || new Map();
        tmp.set(this.getAlias(abstractName), implementation);
        this.contextual.set(concrete, tmp);
    }
    getAlias(abstractName) {
        let result = this.aliases.get(abstractName);
        if (!result) {
            return abstractName;
        }
        if (result === abstractName) {
            throw `[${abstractName}] is aliased to itself!`;
        }
        return this.getAlias(result);
    }
    dropStaleInstances(abstractName) {
        this.instances.delete(abstractName);
        this.aliases.delete(abstractName);
    }
    refresh(abstract, target, method) {
        return this.rebinding(abstract, (app, instance) => {
            if (_.isObject(target) && !!target[method])
                target[method](instance);
        });
    }
    getClosure(abstractName, concrete) {
        return (container, parameters = []) => {
            if (_.isObject(concrete) && !_.isFunction(concrete)) {
                return _.clone(concrete);
            }
            return container.make(abstractName, parameters);
        };
    }
    bind(abstractName, concrete = null, shared = false) {
        this.dropStaleInstances(abstractName);
        if (!(helper_1.isClosure(concrete))) {
            concrete = this.getClosure(abstractName, concrete);
        }
        this.bindings.set(abstractName, {
            concrete: concrete,
            shared: shared
        });
        if (!this.isResolved(abstractName)) {
            this.rebound(abstractName);
        }
        return concrete;
    }
    rebound(abstractName) {
        let instance = this.make(abstractName);
        let callbacks = this.getReboundCallbacks(abstractName);
        callbacks.forEach((callback) => {
            callback.call(this, instance);
        });
    }
    getReboundCallbacks(abstractName) {
        let callbacks = this.reboundCallbacks.get(abstractName);
        if (callbacks) {
            return callbacks;
        }
        return new Set();
    }
    rebinding(abstractName, callback) {
        let callbacks = this.reboundCallbacks.get(abstractName) || new Set();
        callbacks.add(callback);
        this.reboundCallbacks.set(abstractName, callbacks);
        if (this.bound(abstractName)) {
            return this.make(abstractName);
        }
    }
    isResolved(abstractName) {
        if (this.isAlias(abstractName)) {
            abstractName = this.getAlias(abstractName);
        }
        return this.resolved.has(abstractName) || this.instances.get(abstractName);
    }
    make(abstractName, parameters = []) {
        return this.resolve(abstractName, parameters);
    }
    findInContextualBindings(abstractName) {
        let stack = helper_1.end(this.buildStack);
        let contextual = stack ? this.contextual.get(stack) : null;
        return contextual ? contextual.get(abstractName) : null;
    }
    getContextualConcrete(abstractName) {
        let binding = this.findInContextualBindings(abstractName);
        if (!_.isNull(binding)) {
            return binding;
        }
        if (!this.abstractAliases.get(abstractName) || this.abstractAliases.get(abstractName).size === 0) {
            return null;
        }
        for (let alias of this.abstractAliases.get(abstractName).values()) {
            let binding = this.findInContextualBindings(alias);
            if (!_.isNull(binding)) {
                return binding;
            }
        }
        return null;
    }
    resolve(abstractName, parameters = [], raiseEvents = true) {
        abstractName = this.getAlias(abstractName);
        let needsContextualBuild = !_.isEmpty(parameters) || !(_.isNull(this.getContextualConcrete(abstractName)));
        if (this.instances.get(abstractName) && !needsContextualBuild) {
            return this.instances.get(abstractName);
        }
        this.with.add(parameters);
        let concrete = this.getConcrete(abstractName);
        let obj = null;
        if (this.isBuildable(concrete)) {
            obj = this.build(concrete);
        }
        else {
            obj = concrete;
        }
        let extenders = this.getExtenders(abstractName);
        extenders.forEach((extender) => {
            obj = extender(obj, this);
        });
        if (this.isShared(abstractName) && !needsContextualBuild) {
            this.instances.set(abstractName, obj);
        }
        if (raiseEvents) {
            this.fireResolvingCallbacks(abstractName, obj);
        }
        this.with.delete(parameters);
        return obj;
    }
    foregetExtenders(abstractName) {
        this.extenders.delete(this.getAlias(abstractName));
    }
    foregetInstance(abstractName) {
        this.instances.delete(abstractName);
    }
    foregetInstances() {
        this.instances.clear();
    }
    flush() {
        this.instances.clear();
        this.aliases.clear();
        this.bindings.clear();
        this.abstractAliases.clear();
        this.resolved.clear();
    }
    static getInstance() {
        if (_.isNull(this.instance)) {
            this.instance = new this();
        }
        return this.instance;
    }
    static setInstance(container) {
        return this.instance = container;
    }
    getExtenders(abstractName) {
        abstractName = this.getAlias(abstractName);
        return this.extenders.get(abstractName) || new Set();
    }
    fireResolvingCallbacks(abstractName, obj) {
        this.fireCallbackArray(obj, this.globalResolvingCallbacks);
        this.fireCallbackArray(obj, this.getCallbacksForType(abstractName, obj, this.resolvingCallbacks));
        this.fireAfterResolvingCallbacks(abstractName, obj);
    }
    fireAfterResolvingCallbacks(abstractName, obj) {
        this.fireCallbackArray(obj, this.globalAfterResolvingCallbacks);
        this.fireCallbackArray(obj, this.getCallbacksForType(abstractName, obj, this.afterResolvingCallbacks));
    }
    getCallbacksForType(abstractName, obj, callbacksPerType) {
        let results = new Set();
        let callbacks = callbacksPerType.get(abstractName) || new Set();
        ;
        callbacks.forEach((callback) => {
            results.add(callback);
        });
        return results;
    }
    fireCallbackArray(obj, callbacks) {
        callbacks.forEach((callback) => {
            callback(obj, this);
        });
    }
    build(concrete) {
        if (helper_1.isClosure(concrete)) {
            return concrete(this, this.getLastParameterOverride());
        }
        else if (helper_1.isClass(concrete)) {
            this.buildStack.add(concrete);
            return ((parameters) => {
                class F {
                    constructor() {
                        return new concrete.apply(this, parameters);
                    }
                }
                F.prototype = concrete.prototype;
                return new F();
            })(this.getLastParameterOverride());
        }
        else {
            return _.clone(concrete);
        }
    }
    getLastParameterOverride() {
        return this.with.size ? helper_1.end(this.with) : null;
    }
    isBuildable(concrete) {
        return helper_1.isClosure(concrete) || (concrete && !!concrete.constructor);
    }
    getConcrete(abstractName) {
        let concrete = this.getContextualConcrete(abstractName);
        if (!_.isNull(concrete)) {
            return concrete;
        }
        let binding = this.bindings.get(abstractName);
        if (binding) {
            return binding['concrete'];
        }
        return abstractName;
    }
    keys() {
        return _.keys(this.instances);
    }
    has(prop) {
        let k = `${prop}`;
        return this.instances.has(k);
    }
    afterResolving($abstract, $callback) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (helper_1.isClosure($abstract) && _.isNull($callback)) {
            let closure = $abstract;
            this.globalAfterResolvingCallbacks.add(closure);
        }
        else {
            let callbacks = this.afterResolvingCallbacks.get($abstract) || new Set();
            callbacks.add($callback);
            this.afterResolvingCallbacks.set($abstract, callbacks);
        }
    }
    bindIf($abstract, $concrete, $shared) {
    }
    call($callback, $parameters, $defaultMethod) {
    }
    extend($abstract, $closure) {
        $abstract = this.getAlias($abstract);
        let instance = this.instances.get($abstract);
        if (instance) {
            instance = $closure(instance, this);
            this.rebound($abstract);
        }
        else {
            let extenders = this.extenders.get($abstract) || new Set();
            ;
            extenders.add($closure);
            this.extenders.set($abstract, extenders);
            if (this.isResolved($abstract)) {
                this.rebound($abstract);
            }
        }
    }
    factory($abstract) {
        return () => {
            return this.make($abstract);
        };
    }
    get(id) {
        try {
            return this.resolve(id);
        }
        catch (e) {
            if (this.has(id)) {
                throw e;
            }
            throw 'Entity not found';
        }
    }
    removeAbstractAlias($searched) {
        if (!this.aliases.get($searched)) {
            return;
        }
        this.abstractAliases.forEach((aliases, abstractName) => {
            aliases.forEach((alias) => {
                if (alias === $searched) {
                    aliases.delete(alias);
                }
            });
        });
    }
    instance($abstract, $instance) {
        this.removeAbstractAlias($abstract);
        let isBound = this.bound($abstract);
        this.aliases.delete($abstract);
        this.instances.set($abstract, $instance);
        if (isBound) {
            this.rebound($abstract);
        }
        return $instance;
    }
    resolving($abstract, $callback) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isNull($callback) && helper_1.isClosure($abstract)) {
            this.globalResolvingCallbacks.add($abstract);
        }
        else {
            let callbacks = this.resolvingCallbacks.get($abstract) || new Set();
            callbacks.add($callback);
            this.resolvingCallbacks.set($abstract, callbacks);
        }
    }
    singleton($abstract, $concrete) {
        this.bind($abstract, $concrete, true);
    }
    tag($abstracts, $tags) {
    }
    tagged($tag) {
        return undefined;
    }
}
Container.instance = null;
exports.default = Container;
//# sourceMappingURL=Container.js.map