import ServiceProvider from './contracts/ServiceProviderInterface';
import CommandInterface from './contracts/CommandInterface';
import Container from "./container/Container";
import FrameworkInstanceAdapter from "./contracts/FrameworkInstanceAdapterInterface";
import EventListenerInterface from "./contracts/EventListenerInterface";

export default class Application extends Container {
    public static version = '0.0.1';
    private providersContainer: Set<any> = null;
    private showingPageObject: FrameworkInstanceAdapter = null;
    private configs: Map<string, any> = null;
    private dispatcher: EventListenerInterface = null;
    private commandPrefix = 'COMMAND:';

    /*
    * Application 构造函数
    * */
    public constructor () {
        super();
        this.providersContainer = new Set();
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
    public pageChange (route: string) {
        this.showingPageObject = this.make(this.pageKey(route));
    }

    public addPage (route: string, pageObject: any) {
        let adapter = this.configs.get('app.pageAdapter');
        this.singleton(this.pageKey(route), new adapter(pageObject))
    }

    private pageKey (route: string): string {
        return 'page:' + route;
    }

    public run () {
        this.providersContainer.forEach((provider: any) => {
            if ('register' in provider)
                provider.register();
        });
    }
}
