import * as _ from 'underscore';
import {Closure, isClosure} from "../utils/helper";
import ContextualBindingBuilder from "./ContextualBindingBuilder";

export default class Container {
    protected instances: Map<string, any> = null;
    protected aliases: Map<string, string> = null;
    protected abstractAliases: Map<string, string[]> = null;
    protected extenders: Map<string, any> = null;
    protected tags: Map<string, any> = null;
    protected buildStack: any[] = null;
    protected with: Set<any> = null;
    protected contextual: Map<string, any> = null;
    protected reboundCallbacks: Map<string, Set<Closure>> = null;
    protected bindings: Map<string, any> = null;

    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected globalResolvingCallbacks: Map<string, any> = null;

    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected globalAfterResolvingCallbacks: Map<string, any> = null;

    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected resolvingCallbacks: Map<string, any> = null;

    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected afterResolvingCallbacks: Map<string, any> = null;
    protected resolved: Set<string> = null;


    public constructor () {
        this.instances = new Map();
        this.aliases = new Map();
        this.bindings = new Map();
        this.resolved = new Set<string>();
        this.with = new Set<any>();
        this.reboundCallbacks = new Map<string, Set<Closure>>();
    }

    /**
     * Define a contextual binding.
     *
     * @param  string  concrete
     * @return ContextualBindingBuilder
     */
    public when (concrete: string): ContextualBindingBuilder {
        return new ContextualBindingBuilder(this, this.getAlias(concrete));
    }

    public bound (abstractName: string): boolean {
        return this.bindings.get(abstractName) ||
            this.instances.get(abstractName) ||
            this.isAlias(abstractName);
    }

    public isShared (abstractName: string): boolean {
        let bind = null;
        return this.instances.get(abstractName) ||
            ((bind = this.bindings.get(abstractName))
                && !!bind['shared']);
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
        let set: string[] = this.abstractAliases.get(abstractName) || [];
        set.push(alias)
        this.abstractAliases.set(abstractName, set);
    }

    public addContextualBinding (concrete: string, abstractName: string, implementation: string | Closure) {
        let tmp: Map<string, string | Closure> = this.contextual.get(concrete) || new Map();
        tmp.set(this.getAlias(abstractName), implementation);
        this.contextual.set(concrete, tmp);
    }

    public getAlias (abstractName: string): string | null {
        console.log(abstractName);
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

    public getClosure (abstractName: string, concrete: any): Closure {
        return (container: Container, parameters: any[] = []): any => {
            if (_.isObject(concrete) && !_.isFunction(concrete)) {
                return concrete;
            }
            return container.make(abstractName, parameters);
        }
    }

    public bind (abstractName: string, concrete: Closure | object | null = null, shared = false) {
        this.dropStaleInstances(abstractName);

        if (!(concrete instanceof Function)) {
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
        let result = this.buildStack.length;
    }

    protected getContextualConcrete (abstractName: string) {

    }

    protected resolve (abstractName: string, parameters: any = []): any {
        abstractName = this.getAlias(abstractName);
        let needsContextualBuild = !_.isEmpty(parameters) || !_.isNull(this.getContextualConcrete(abstractName));
        if (this.instances.get(abstractName) && !needsContextualBuild) {
            return this.instances.get(abstractName);
        }

        this.with.add(parameters);

        let concrete = this.getConcrete(abstractName);
        if (this.isBuildable(concrete)) {
            return this.build(concrete);
        } else {
            return this.make(abstractName, parameters);
        }
    }

    public build (concrete: any): any {
        if (concrete) {
            console.log('build function', concrete);
            return concrete;
        }
    }

    protected isBuildable (concrete: any): boolean {
        return isClosure(concrete) || !!concrete.constructor;
    }

    protected getConcrete (abstractName: string): any {
        let concrete: any = this.getContextualConcrete(abstractName);
        if (_.isNull(concrete)) {
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
}
