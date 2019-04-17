import RouterAdapterInterface from "../../src/contracts/RouterAdapterInterface";
import VueRouter, {RouteConfig, RouterOptions} from 'vue-router';

export default class VueRouterAdapter implements RouterAdapterInterface {
    private router: VueRouter = null;
    private options: RouterOptions = {};
    private routes: RouteConfig[] = [];
    private routeStack: any[] = [];

    public constructor () {

    }

    public push (): void {

    }

    public replace () {

    }

    public load () {
        this.router = new VueRouter(this.options);
    }

    public addRoute (route: string, config: RouteConfig): void {
        config.name = route;
        this.routes.push(config);
    }
}
