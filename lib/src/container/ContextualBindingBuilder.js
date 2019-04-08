"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextualBindingBuilder {
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
exports.default = ContextualBindingBuilder;
//# sourceMappingURL=ContextualBindingBuilder.js.map