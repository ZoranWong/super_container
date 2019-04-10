import RouterAdapterInterface from "../contracts/RouterAdapterInterface";
import VueRouter from 'vue-router';

export default class VueRouterAdapter implements RouterAdapterInterface {
    private router: VueRouter = null;
    private routes: object[] = [];
    public constructor () {

    }

    public push (): void {
    }
    public load() {

    }
}
