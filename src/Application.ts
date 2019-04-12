import ServiceProvider from './contracts/ServiceProviderInterface';
import CommandInterface from './contracts/CommandInterface';
import Container from "./container/Container";
import FrameworkInstanceAdapter from "./contracts/FrameworkInstanceAdapterInterface";
import EventListenerInterface from "./contracts/EventListenerInterface";
import RouterAdapterInterface from "./contracts/RouterAdapterInterface";
import confData from './configs';
import {Closure} from "./utils/helper";
import ApplicationOptions from "./types/ApplicationOptions";
import BrowserEventListenerAdapter from "./adapters/BrowserEventListenerAdapter";
import * as _ from 'underscore';
import Dispatcher from "./events/Dispatcher";

export default class Application extends Container {
    public static version = '0.0.1';
    private providersContainer: Set<ServiceProvider> = null;
    private pageEntry: FrameworkInstanceAdapter = null;
    private mainEntry: FrameworkInstanceAdapter = null;
    private dispatcher: EventListenerInterface = null;
    private commandPrefix: string = 'COMMAND:';
    private router: RouterAdapterInterface = null;
    private readonly bootComponent: any = null;
    private readonly rootId: string = 'id';
    private readonly adapter: any = null;

    /*
    * Application 构造函数
    * */
    public constructor ({rootId, component, adapter, dispatcher, configs}: ApplicationOptions =
                            {rootId: 'id', component: null, adapter: null, dispatcher: BrowserEventListenerAdapter}) {
        super();
        this.bootComponent = component;
        this.rootId = rootId;
        this.providersContainer = new Set<ServiceProvider>();
        this.singleton('configs', _.extend(confData, configs));
        let providers: any[] = this.configs('app.providers');
        providers.forEach((provider: any) => {
            this.register(provider);
        });
        this.dispatcher = new Dispatcher(dispatcher || BrowserEventListenerAdapter);
        this.adapter = adapter;
    }

    /*
    * execute command by command name
    * @param name
    * @param parameters
    * @return any
    * */
    public command (name: string, ...parameters: any): any {
        let command: CommandInterface = this.make(this.commandName(name));
        return command.handle.apply(this.pageEntry, parameters);
    }

    /**
     * make command full name
     *  @param name
     * @return string
     * * */
    private commandName (name: string): string {
        return this.commandPrefix + name;
    }

    /**
     * Register the service provider to application container
     * @param serviceProvider
     * */
    public register (serviceProvider: any): void {
        let provider: ServiceProvider = new serviceProvider(this);
        this.providersContainer.add(provider);
    }

    /*
    *Register command to application container
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

    public configs (key: string = null, defaultVal: any = null): any {
        let configs: any = this.get('configs');
        if(key){
            let keys = key.split('.');
            for (let k in keys) {
                configs = configs[keys[k]];
            }
        }
        return configs || defaultVal;
    }

    /*
    * Add route to application
    * @param route
    * @param options
    * */
    public addRoute (route: string, options: any = null) {
        let multiple = this.configs('app.multiple', false);
        if (multiple) {
            let adapter = this.adapter;
            let instance = this.buildPage(adapter, options);
            this.singleton(this.pageKey(route), instance);
        }
        this.router.addRoute(route, options);
    }

    /*
    * Build page component(vue/react) object
    * @param adapter
    * @param options
    * @return FrameworkInstanceAdapter
    * */
    private buildPage (adapter: any, options: any = null): FrameworkInstanceAdapter {
        let instance: FrameworkInstanceAdapter = new adapter(options);
        instance.mount();
        return instance;
    }

    /*
    * Get full route name
    * @param route
    * @return string
    * */
    private pageKey (route: string): string {
        return 'page:' + route;
    }

    public run () {
        this.providersContainer.forEach((provider: ServiceProvider) => {
            if ('register' in provider)
                provider.register();
        });
        this.mainEntry = new this.adapter(this, this.rootId, {
            render: (h: Closure) => h(this.bootComponent),
            beforeCreate: () => {

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
