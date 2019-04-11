export default class ContextualBindingBuilder {
    constructor(container, concrete) {
        this.container = null;
        this.need = null;
        this.concrete = null;
        this.concrete = concrete;
        this.container = container;
    }
    give(implementation) {
        this.container.addContextualBinding(this.concrete, this.need, implementation);
    }
    needs(abstract) {
        this.need = abstract;
        return this;
    }
}
//# sourceMappingURL=ContextualBindingBuilder.js.map