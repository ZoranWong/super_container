import ServiceProvider from './contracts/ServiceProviderInterface';
import CommandInterface from './contracts/CommandInterface';
import Container from "./container/Container";
import FrameworkInstanceAdapter from "./contracts/FrameworkInstanceAdapterInterface";
import EventListenerInterface from "./contracts/EventListenerInterface";
import RouterAdapterInterface from "./contracts/RouterAdapterInterface";

export default class Application extends Container {
    public static version = '0.0.1';
    private providersContainer: Set<ServiceProvider> = null;
    private showingPageObject: FrameworkInstanceAdapter = null;
    private configs: Map<string, any> = null;
    private dispatcher: EventListenerInterface = null;
    private commandPrefix = 'COMMAND:';
    private router: RouterAdapterInterface = null;

    /*
    * Application 构造函数
    * */
    public constructor () {
        super();
        this.providersContainer = new Set<ServiceProvider>();
        this.configs = new Map();
        this.dispatcher = this.configs.get('app.dispatcher');
    }

    public command (name: string, ...paramters: any): any {
        let command = this.make(this.commandName(name));
        return command.handle.call(this.showingPageObject, paramters);
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
        command = new command(this);
        this.singleton(this.commandName(command.commandName()), function () {
            return command;
        });
    }

    public redirect (route: string) {
        this.showingPageObject = this.get(this.pageKey(route));
    }

    public addRoute (route: string, options: any = null) {
        let multiple = this.configs.get('app.multiple');
        if (multiple) {
            let adapter = this.configs.get('app.pageAdapter');
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
        this.providersContainer.forEach((provider: ServiceProvider) => {
            if ('register' in provider)
                provider.register();
        });
        this.showingPageObject.mount();
    }
}
