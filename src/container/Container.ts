import * as _ from 'underscore';
import {Closure, isClosure, isClass, end} from "../utils/helper";
import ContextualBindingBuilder from "./ContextualBindingBuilder";
import ContainerContract from '../Contracts/Container';

export default class Container implements ContainerContract {
    protected static instance: Container = null;
    protected instances: Map<string, any> = null;
    protected aliases: Map<string, string> = null;
    protected abstractAliases: Map<string, Set<string>> = null;
    protected extenders: Map<string, Set<Closure>> = null;
    protected tags: Map<string, any> = null;
    protected buildStack: Set<any> = null;
    protected with: Set<any> = null;
    protected contextual: Map<any, any> = null;
    protected reboundCallbacks: Map<string, Set<Closure>> = null;
    protected bindings: Map<string, { shared: boolean, concrete: Closure | object } | null> = null;

    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected globalResolvingCallbacks: Set<Closure> = null;

    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected globalAfterResolvingCallbacks: Set<Closure> = null;

    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected resolvingCallbacks: Map<string, Set<Closure>> = null;

    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected afterResolvingCallbacks: Map<string, Set<Closure>> = null;

    protected resolved: Set<string> = null;


    public constructor () {
        this.instances = new Map<string, any>();
        this.aliases = new Map<string, string>();
        this.abstractAliases = new Map<string, Set<string>>();
        this.extenders = new Map<string, Set<Closure>>();
        this.bindings = new Map<string, { shared: boolean, concrete: object | Closure } | null>();
        this.resolved = new Set<string>();
        this.with = new Set<any>();
        this.reboundCallbacks = new Map<string, Set<Closure>>();
        this.globalResolvingCallbacks = new Set<Closure>();
        this.resolvingCallbacks = new Map<string, Set<Closure>>();
        this.afterResolvingCallbacks = new Map<string, Set<Closure>>();
        this.globalAfterResolvingCallbacks = new Set<Closure>();
        this.contextual = new Map<any, any>();
        this.buildStack = new Set<any>();
    }

    /**
     * Define a contextual binding.
     *
     * @param  string  concrete
     * @return ContextualBindingBuilder
     */
    public when (concrete: any): ContextualBindingBuilder {
        return new ContextualBindingBuilder(this, this.getAlias(concrete));
    }

    public bound (abstractName: string): boolean {
        return this.bindings.get(abstractName) ||
            this.instances.get(abstractName) ||
            this.isAlias(abstractName);
    }

    public getBindings (): Map<string, { shared: boolean, concrete: Closure | object } | null> {
        return this.bindings;
    }

    public isShared (abstractName: string): boolean {
        let bind = this.bindings.get(abstractName);
        return this.instances.get(abstractName) ||
            (bind && !!bind['shared']);
    }

    public isAlias (abstractName: string): boolean {
        return !!this.aliases.get(abstractName);
    }

    public isEmpty (): boolean {
        return this.instances.size === 0;
    }

    public size (): number {
        return this.instances.size;
    }

    public alias (abstractName: string, alias: string) {
        this.aliases.set(alias, abstractName);
        let set: Set<string> = this.abstractAliases.get(abstractName) || new Set<string>();
        set.add(alias)
        this.abstractAliases.set(abstractName, set);
    }

    public addContextualBinding (concrete: any, abstractName: string, implementation: string | Closure) {
        let tmp: Map<string, string | Closure> = this.contextual.get(concrete) || new Map();
        tmp.set(this.getAlias(abstractName), implementation);
        this.contextual.set(concrete, tmp);
    }

    public getAlias (abstractName: string): string | null {
        let result = this.aliases.get(abstractName);
        if (!result) {
            return abstractName;
        }
        if (result === abstractName) {
            throw  `[${abstractName}] is aliased to itself!`
        }
        return this.getAlias(result);
    }

    protected dropStaleInstances (abstractName: string) {
        this.instances.delete(abstractName);
        this.aliases.delete(abstractName);
    }

    public refresh (abstract: string, target: any, method: string) {
        return this.rebinding(abstract, (app: Container, instance: any) => {
            if (_.isObject(target) && !!target[method]) target[method](instance);
        });
    }

    public getClosure (abstractName: string, concrete: any): Closure {
        return (container: Container, parameters: any[] = []): any => {
            if (_.isObject(concrete) && !_.isFunction(concrete)) {
                return _.clone(concrete);
            }
            return container.make(abstractName, parameters);
        }
    }

    public bind (abstractName: string, concrete: Closure | object | null = null, shared = false) {
        this.dropStaleInstances(abstractName);

        if (!(isClosure(concrete))) {
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

    protected rebound (abstractName: string) {
        let instance = this.make(abstractName);
        let callbacks: Set<Closure> = this.getReboundCallbacks(abstractName);
        callbacks.forEach((callback) => {
            callback.call(this, instance);
        });
    }

    protected getReboundCallbacks (abstractName: string): Set<Closure> {
        let callbacks: Set<Closure> = this.reboundCallbacks.get(abstractName);
        if (callbacks) {
            return callbacks;
        }
        return new Set<Closure>();
    }

    public rebinding (abstractName: string, callback: Closure) {
        let callbacks: Set<Closure> = this.reboundCallbacks.get(abstractName) || new Set<Closure>();
        callbacks.add(callback);
        this.reboundCallbacks.set(abstractName, callbacks);
        if (this.bound(abstractName)) {
            return this.make(abstractName);
        }
    }


    public isResolved (abstractName: string): boolean {
        if (this.isAlias(abstractName)) {
            abstractName = this.getAlias(abstractName);
        }

        return this.resolved.has(abstractName) || this.instances.get(abstractName);
    }

    public make (abstractName: string, parameters: any = []): any {
        return this.resolve(abstractName, parameters);
    }

    protected findInContextualBindings (abstractName: string) {
        let stack = end(this.buildStack);
        let contextual: Map<string, string | Closure> = stack ? this.contextual.get(stack) : null;
        return contextual ? contextual.get(abstractName) : null;
    }

    protected getContextualConcrete (abstractName: string): string | Closure | null {
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

    protected resolve (abstractName: string, parameters: any = [], raiseEvents: boolean = true): any {
        abstractName = this.getAlias(abstractName);
        let needsContextualBuild = !_.isEmpty(parameters) || !(_.isNull(this.getContextualConcrete(abstractName)));

        if (this.instances.get(abstractName) && !needsContextualBuild) {
            return this.instances.get(abstractName);
        }

        this.with.add(parameters);

        let concrete = this.getConcrete(abstractName);
        let obj: any = null;
        if (this.isBuildable(concrete)) {
            obj = this.build(concrete);
        } else {
            obj = concrete;
        }
        let extenders = this.getExtenders(abstractName);
        extenders.forEach((extender: Closure) => {
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

    public foregetExtenders (abstractName: string) {
        this.extenders.delete(this.getAlias(abstractName));
    }

    public foregetInstance (abstractName: string) {
        this.instances.delete(abstractName);
    }

    public foregetInstances () {
        this.instances.clear();
    }

    public flush () {
        this.instances.clear();
        this.aliases.clear();
        this.bindings.clear();
        this.abstractAliases.clear();
        this.resolved.clear();
    }

    public static getInstance () {
        if (_.isNull(this.instance)) {
            this.instance = new this();
        }
        return this.instance;
    }

    public static setInstance (container: Container): Container {
        return this.instance = container;
    }

    public getExtenders (abstractName: string): Set<Closure> {
        abstractName = this.getAlias(abstractName);
        return this.extenders.get(abstractName) || new Set<Closure>();
    }

    protected fireResolvingCallbacks (abstractName: string, obj: object) {
        this.fireCallbackArray(obj, this.globalResolvingCallbacks)
        this.fireCallbackArray(obj, this.getCallbacksForType(abstractName, obj, this.resolvingCallbacks));
        this.fireAfterResolvingCallbacks(abstractName, obj);
    }

    protected fireAfterResolvingCallbacks (abstractName: string, obj: object) {
        this.fireCallbackArray(obj, this.globalAfterResolvingCallbacks);
        this.fireCallbackArray(obj, this.getCallbacksForType(abstractName, obj, this.afterResolvingCallbacks));
    }

    protected getCallbacksForType (abstractName: string, obj: object, callbacksPerType: Map<string, Set<Closure>>): Set<Closure> {
        let results: Set<Closure> = new Set<Closure>();
        let callbacks = callbacksPerType.get(abstractName)||new Set<Closure>();;
        callbacks.forEach((callback: Closure) => {
            results.add(callback);
        });
        return results;
    }

    protected fireCallbackArray (obj: object, callbacks: Set<Closure>) {
        callbacks.forEach((callback: Closure) => {
            callback(obj, this);
        });
    }


    public build (concrete: any): any {
        if (isClosure(concrete)) {
            return concrete(this, this.getLastParameterOverride());
        } else if (isClass(concrete)) {
            this.buildStack.add(concrete);
            return ((parameters: any[]) => {
                class F {
                    constructor () {
                        return new concrete.apply(this, parameters);
                    }
                }

                F.prototype = concrete.prototype;
                return new F();
            })(this.getLastParameterOverride());
        } else {
            return _.clone(concrete);
        }
    }

    protected getLastParameterOverride (): any {
        return this.with.size ? end(this.with) : null;
    }


    protected isBuildable (concrete: any): boolean {
        return isClosure(concrete) || (concrete && !!concrete.constructor);
    }

    protected getConcrete (abstractName: string): any {
        let concrete: any = this.getContextualConcrete(abstractName);
        if (!_.isNull(concrete)) {
            return concrete;
        }
        let binding: any = this.bindings.get(abstractName);
        if (binding) {
            return binding['concrete'];
        }

        return abstractName;
    }

    public keys (): string[] {
        return _.keys(this.instances);
    }

    public has (prop: string | number): boolean {
        let k: string = `${prop}`;
        return this.instances.has(k);
    }

    public afterResolving ($abstract: any, $callback: Closure): void {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (isClosure($abstract) && _.isNull($callback)) {
            let closure: Closure = $abstract;
            this.globalAfterResolvingCallbacks.add(closure);
        } else {
            let callbacks: Set<Closure> = this.afterResolvingCallbacks.get($abstract) || new Set<Closure>();
            callbacks.add($callback);
            this.afterResolvingCallbacks.set($abstract, callbacks);
        }
    }

    bindIf ($abstract: string, $concrete: any, $shared: boolean): void {
    }

    call ($callback: Closure | string, $parameters: any, $defaultMethod: string | null): any {
    }

    public extend ($abstract: string, $closure: Closure): void {
        $abstract = this.getAlias($abstract);
        let instance = this.instances.get($abstract);
        if (instance) {
            instance = $closure(instance, this);
            this.rebound($abstract);
        } else {
            let extenders = this.extenders.get($abstract) || new Set<Closure>();
            ;
            extenders.add($closure);
            this.extenders.set($abstract, extenders);
            if (this.isResolved($abstract)) {
                this.rebound($abstract);
            }
        }
    }

    public factory ($abstract: string): Closure {
        return () => {
            return this.make($abstract);
        };
    }

    public get (id: string): any {
        try {
            return this.resolve(id);
        } catch (e) {
            if (this.has(id)) {
                throw e;
            }
            throw 'Entity not found';
        }
    }

    protected removeAbstractAlias ($searched: string) {
        if (!this.aliases.get($searched)) {
            return;
        }
        this.abstractAliases.forEach((aliases: Set<string>, abstractName: string) => {
            aliases.forEach((alias: string) => {
                if (alias === $searched) {
                    aliases.delete(alias);
                }
            })
        })
    }

    public instance ($abstract: string, $instance: any): any {
        this.removeAbstractAlias($abstract);
        let isBound = this.bound($abstract);
        this.aliases.delete($abstract);
        this.instances.set($abstract, $instance);
        if (isBound) {
            this.rebound($abstract);
        }
        return $instance;
    }

    public resolving ($abstract: any, $callback: Closure): void {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }

        if (_.isNull($callback) && isClosure($abstract)) {
            this.globalResolvingCallbacks.add($abstract);
        } else {
            let callbacks = this.resolvingCallbacks.get($abstract) || new Set<Closure>();
            callbacks.add($callback);
            this.resolvingCallbacks.set($abstract, callbacks);
        }
    }

    public singleton ($abstract: string, $concrete: any): void {
        this.bind($abstract, $concrete, true);
    }

    tag ($abstracts: Set<string> | string, $tags: Set<string> | string): void {
    }

    tagged ($tag: string): Set<string> {
        return undefined;
    }
}
