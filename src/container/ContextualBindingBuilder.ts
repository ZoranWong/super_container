import ContextualBindingBuilderContract from '../contracts/ContextualBindingBuilder';
import {Closure} from "../utils/helper";
import Container from "./Container";

export default class ContextualBindingBuilder implements ContextualBindingBuilderContract {
    protected container: Container = null;
    protected need: string = null;
    protected concrete: string = null;

    public constructor (container: Container, concrete: string) {
        this.concrete = concrete;
        this.container = container;
    }

    give (implementation: string | Closure): void {
        this.container.addContextualBinding(this.concrete, this.need, implementation);
    }

    needs (abstract: string): this {
        this.need = abstract;
        return this;
    }

}
