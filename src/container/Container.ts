import * as _ from 'underscore';
import {Closure} from "../utils/helper";
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
    protected reboundCallbacks: Map<string, any> = null;
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

    public bound (abstract: string): boolean {
        return this.bindings.get(abstract) ||
            this.instances.get(abstract) ||
            this.isAlias(abstract);
    }

    public isShared (abstract: string): boolean {
        let bind = null;
        return this.instances.get(abstract) ||
            ((bind = this.bindings.get(abstract)) && !!bind['shared']);
    }

    public isAlias (abstract: string): boolean {
        return !!this.aliases.get(abstract);
    }

    public isEmpty (): boolean {
        return this.instances.size === 0;
    }

    public size (): number {
        return this.instances.size;
    }

    public alias (abstract: string, alias: string) {
        this.aliases.set(alias, abstract);
        let set: string[] = this.abstractAliases.get(abstract) || [];
        set.push(alias)
        this.abstractAliases.set(abstract, set);
    }

    public addContextualBinding (concrete: string, abstract: string, implementation: string | Closure) {
        let tmp: Map<string, string | Closure> = this.contextual.get(concrete) || new Map();
        tmp.set(this.getAlias(abstract), implementation);
        this.contextual.set(concrete, tmp);
    }

    public getAlias (abstract: string): string | null {
        let result = this.aliases.get(abstract);
        if (result) {
            return result;
        }
        if (result === abstract) {
            throw  `[${abstract}] is aliased to itself!`
        }
        return this.getAlias(result);
    }

    protected dropStaleInstances (abstract: string) {
        this.instances.delete(abstract);
        this.aliases.delete(abstract);
    }

    public getClosure (abstract: string, concrete: any): Closure {
        return (container: Container, parameters: any[] = []): any => {
            if (_.isObject(concrete) && !_.isFunction(concrete)) {
                return ((): any => {
                    class F {
                        constructor (args: any[]) {
                            return concrete.constructor.apply(this, args);
                        }
                    }

                    F.prototype = concrete.constructor.prototype;
                    return new F(parameters);
                })();
            }
            return container.make(abstract, parameters);
        }
    }

    public bind (abstract: string, concrete: Closure | object | null = null, shared = false) {
        this.dropStaleInstances(abstract);

        if (!(concrete instanceof Function)) {
            concrete = this.getClosure(abstract, concrete);
        }
        this.bindings.set(abstract, {
            concrete: concrete,
            shared: shared
        });
        if (!this.isResolved(abstract)) {
            this.rebound(abstract);
        }
        return concrete;
    }

    protected rebound (abstract: string) {
        let instance = this.make(abstract);
        let callbacks: Closure[] = this.getReboundCallbacks(abstract);
        callbacks.forEach((callback) => {
            callback.call(this, instance);
        });
    }

    protected getReboundCallbacks (abstract: string): Closure[] {
        let callbacks: Closure[] = this.reboundCallbacks.get(abstract);
        if (callbacks) {
            return callbacks;
        }
        return [];
    }


    public isResolved (abstract: string): boolean {
        let result = abstract;
        if (this.isAlias(abstract)) {
            result = this.getAlias(abstract);
        }

        return this.resolved.has(result) || this.instances.get(result);
    }

    public make (abstract: string, parameters: any = []): any {
        return this.resolve(abstract, parameters);
    }

    protected findInContextualBindings(abstract: string) {
        let result = this.buildStack.length;
    }

    protected getContextualConcrete(abstract: string) {

    }
    protected resolve (abstract: string, parameters: any = []): any {
        let abs = this.getAlias(abstract);
        let needsContextualBuild = !_.isEmpty(parameters) || !_.isNull(this.getContextualConcrete(abstract))
    }

    public keys (): string[] {
        return _.keys(this.instances);
    }

    public has (prop: string | number): boolean {
        let k: string = `${prop}`;
        return this.instances.has(k);
    }
}
