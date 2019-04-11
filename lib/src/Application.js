import Container from "./container/Container";
import VueAdapter from './adapters/VueAdapter';
export default class Application extends Container {
    constructor(root = 'id', component = null) {
        super();
        this.providersContainer = null;
        this.pageEntry = null;
        this.mainEntry = null;
        this.configs = null;
        this.dispatcher = null;
        this.commandPrefix = 'COMMAND:';
        this.router = null;
        this.bootComponent = null;
        this.rootId = 'id';
        this.bootComponent = component;
        this.rootId = root;
        this.providersContainer = new Set();
        this.configs = new Map();
        this.dispatcher = this.configs.get('app.dispatcher');
    }
    command(name, ...paramters) {
        let command = this.make(this.commandName(name));
        console.log(name, paramters);
        return command.handle.call(this.pageEntry, paramters);
    }
    commandName(name) {
        return this.commandPrefix + name;
    }
    register(serviceProvider) {
        let provider = new serviceProvider(this);
        this.providersContainer.add(provider);
    }
    registerCommand(command) {
        let commandInstance = new command(this);
        this.singleton(this.commandName(commandInstance.commandName()), function () {
            return commandInstance;
        });
    }
    redirect(route) {
        this.pageEntry = this.get(this.pageKey(route));
    }
    addRoute(route, options = null) {
        let multiple = this.configs.get('app.multiple');
        if (multiple) {
            let adapter = this.configs.get('app.adapter');
            let instance = this.buildPage(adapter, options);
            this.singleton(this.pageKey(route), instance);
        }
        this.router.addRoute(route, options);
    }
    buildPage(adapter, options = null) {
        let instance = new adapter(options);
        instance.mount();
        return instance;
    }
    pageKey(route) {
        return 'page:' + route;
    }
    run() {
        this.providersContainer.forEach((provider) => {
            if ('register' in provider)
                provider.register();
        });
        let adapter = this.configs.get('app.adapter') || VueAdapter;
        this.mainEntry = new adapter(this, this.rootId, {
            render: (h) => h(this.bootComponent),
            beforeCreate: () => {
                this.printSlogan();
            },
            created: () => {
                this.providersContainer.forEach((provider) => {
                    if ('boot' in provider)
                        provider.boot();
                });
            }
        });
        this.mainEntry.mount();
    }
    printSlogan() {
        console.log('%c' +
            ' ======================================================== \n' +
            ' ||                                                    || \n' +
            ' ||         SUPER CONTAINER ELEGANT WAY TO CODE        || \n' +
            ' || Make web front development more elegant and easier || \n' +
            ' ||                                                    || \n' +
            ' ======================================================== ', 'background:#aaa;color:#bada55');
    }
}
Application.version = '0.0.1';
//# sourceMappingURL=Application.js.map