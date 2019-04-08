import ContainerInterface from './ContainerInterface';
import {Closure, isClosure, isClass} from "../utils/helper";
import ContextualBindingBuilder from '../contracts/ContextualBindingBuilder';
export default interface Container extends ContainerInterface {
    /**
     * Determine if the given abstract type has been bound.
     *
     * @param  string  $abstract
     * @return bool
     */
    bound ($abstract: string): boolean;

    /**
     * Alias a type to a different name.
     *
     * @param  string  $abstract
     * @param  string  $alias
     * @return void
     */
    alias ($abstract: string, $alias: string): void;

    /**
     * Assign a set of tags to a given binding.
     *
     * @param  array|string  $abstracts
     * @param  array|mixed   ...$tags
     * @return void
     */
    tag ($abstracts: Set<string> | string, $tags: Set<string> | string): void;

    /**
     * Resolve all of the bindings for a given tag.
     *
     * @param  string  $tag
     * @return array
     */
    tagged ($tag: string): Set<string>;

    /**
     * Register a binding with the container.
     *
     * @param  string  $abstract
     * @param  \Closure|string|null  $concrete
     * @param  bool  $shared
     * @return void
     */
    bind ($abstract: string, $concrete: any, $shared: boolean): void;

    /**
     * Register a binding if it hasn't already been registered.
     *
     * @param  string  $abstract
     * @param  \Closure|string|null  $concrete
     * @param  bool  $shared
     * @return void
     */
    bindIf ($abstract: string, $concrete: any, $shared: boolean): void;

    /**
     * Register a shared binding in the container.
     *
     * @param  string  $abstract
     * @param  \Closure|string|null  $concrete
     * @return void
     */
    singleton ($abstract: string, $concrete: any): void;

    /**
     * "Extend" an abstract type in the container.
     *
     * @param  string    $abstract
     * @param  \Closure  $closure
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    extend ($abstract: string, $closure: Closure): void;

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string  $abstract
     * @param  mixed   $instance
     * @return mixed
     */
    instance ($abstract: string, $instance: any): void;

    /**
     * Define a contextual binding.
     *
     * @param  string  $concrete
     * @return \Illuminate\Contracts\Container\ContextualBindingBuilder
     */
    when ($concrete: string): ContextualBindingBuilder;

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string  $abstract
     * @return \Closure
     */
    factory ($abstract: string): Closure;

    /**
     * Resolve the given type from the container.
     *
     * @param  string  $abstract
     * @param  array  $parameters
     * @return mixed
     */
    make ($abstract: string, $parameters: any): any;

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @param  string|null  $defaultMethod
     * @return mixed
     */
    call ($callback: Closure|string, $parameters: any, $defaultMethod: string|null): any;

    /**
     * Determine if the given abstract type has been resolved.
     *
     * @param  string $abstract
     * @return bool
     */
    isResolved ($abstract: string): boolean;

    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  $callback
     * @return void
     */
    resolving ($abstract: any, $callback: Closure ): void;

    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  $callback
     * @return void
     */
    afterResolving ($abstract: any, $callback: Closure): void;
}
