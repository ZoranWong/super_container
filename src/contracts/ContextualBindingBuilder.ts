import {Closure} from '../utils/helper';
export default interface ContextualBindingBuilder {
    needs(abstract: string): this;
    give(implementation: string|Closure): void;
}
