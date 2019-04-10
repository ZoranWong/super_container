import ServiceProvider from './contracts/ServiceProviderInterface';
import CommandInterface from './contracts/CommandInterface';
import Container from "./container/Container";
import FrameworkInstanceAdapter from "./contracts/FrameworkInstanceAdapterInterface";
import EventListenerInterface from "./contracts/EventListenerInterface";
import RouterAdapterInterface from "./contracts/RouterAdapterInterface";
import VueAdapter from './adapters/VueAdapter';
import {Closure} from "./utils/helper";

export default class Application extends Container {
    public static version = '0.0.1';
    private providersContainer: Set<ServiceProvider> = null;
    private pageEntry: FrameworkInstanceAdapter = null;
    private mainEntry: FrameworkInstanceAdapter = null;
    private configs: Map<string, any> = null;
    private dispatcher: EventListenerInterface = null;
    private commandPrefix: string = 'COMMAND:';
    private router: RouterAdapterInterface = null;
    private bootComponent: any = null;
    private rootId: string = '#id';

    /*
    * Application 构造函数
    * */
    public constructor (root: string, component: any) {
        super();
        this.bootComponent = component;
        this.rootId = root;
        this.providersContainer = new Set<ServiceProvider>();
        this.configs = new Map();
        this.dispatcher = this.configs.get('app.dispatcher');
    }

    public command (name: string, ...paramters: any): any {
        let command = this.make(this.commandName(name));
        return command.handle.call(this.pageEntry, paramters);
    }

    public commandName (name: string): string {
        return this.commandPrefix + name;
    }

    /**
     * @param serviceProvider
     * */
    public register (serviceProvider: any): void {
        let provider: ServiceProvider = new serviceProvider(this);
        this.providersContainer.add(provider);
    }

    /*
    * @param command
    * */
    public registerCommand (command: any): void {
        let commandInstance: CommandInterface = new command(this);
        this.singleton(this.commandName(commandInstance.commandName()), function () {
            return commandInstance;
        });
    }

    public redirect (route: string) {
        this.pageEntry = this.get(this.pageKey(route));
    }

    public addRoute (route: string, options: any = null) {
        let multiple = this.configs.get('app.multiple');
        if (multiple) {
            let adapter = this.configs.get('app.adapter');
            let instance = this.buildPage(adapter, options);
            this.singleton(this.pageKey(route), instance);
        }
        this.router.push(route, options);
    }

    private buildPage (adapter: any, options: any = null): FrameworkInstanceAdapter {
        let instance: FrameworkInstanceAdapter = new adapter(options);
        instance.mount();
        return instance;
    }

    private pageKey (route: string): string {
        return 'page:' + route;
    }

    public run () {
        let adapter = this.configs.get('app.adapter') || VueAdapter;
        this.mainEntry = new adapter(this, this.rootId, {
            render: (h: Closure) => h(this.bootComponent),
            beforeCreate: () => {
                this.providersContainer.forEach((provider: ServiceProvider) => {
                    if ('register' in provider)
                        provider.register();
                });
            },
            created: () => {
                this.providersContainer.forEach((provider: ServiceProvider) => {
                    if ('boot' in provider)
                        provider.boot();
                });
            }
        });
        this.mainEntry.mount();
    }
}
