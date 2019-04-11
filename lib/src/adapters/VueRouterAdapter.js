import VueRouter from 'vue-router';
export default class VueRouterAdapter {
    constructor() {
        this.router = null;
        this.options = {};
        this.routes = [];
        this.routeStack = [];
    }
    push() {
    }
    replace() {
    }
    load() {
        this.router = new VueRouter(this.options);
    }
    addRoute(route, config) {
        config.name = route;
        this.routes.push(config);
    }
}
//# sourceMappingURL=VueRouterAdapter.js.map