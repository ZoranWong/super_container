import Container from "./container/Container";
import confData from './configs';
import BrowserEventListenerAdapter from "./adapters/BrowserEventListenerAdapter";
import * as _ from 'underscore';
import Dispatcher from "./events/Dispatcher";
export default class Application extends Container {
    constructor({ rootId, component, adapter, dispatcher, configs } = { rootId: 'id', component: null, adapter: null, dispatcher: BrowserEventListenerAdapter }) {
        super();
        this.providersContainer = null;
        this.pageEntry = null;
        this.mainEntry = null;
        this.dispatcher = null;
        this.commandPrefix = 'COMMAND:';
        this.router = null;
        this.bootComponent = null;
        this.rootId = 'id';
        this.adapter = null;
        this.bootComponent = component;
        this.rootId = rootId;
        this.providersContainer = new Set();
        this.singleton('configs', _.extend(confData, configs));
        let providers = this.configs('app.providers');
        providers.forEach((provider) => {
            this.register(provider);
        });
        this.dispatcher = new Dispatcher(dispatcher || BrowserEventListenerAdapter);
        this.adapter = adapter;
    }
    command(name, ...parameters) {
        let command = this.make(this.commandName(name));
        return command.handle.apply(this.pageEntry, parameters);
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
    configs(key = null, defaultVal = null) {
        let configs = this.get('configs');
        if (key) {
            let keys = key.split('.');
            for (let k in keys) {
                configs = configs[keys[k]];
            }
        }
        return configs || defaultVal;
    }
    addRoute(route, options = null) {
        let multiple = this.configs('app.multiple', false);
        if (multiple) {
            let adapter = this.adapter;
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
        this.mainEntry = new this.adapter(this, this.rootId, {
            render: (h) => h(this.bootComponent),
            beforeCreate: () => {
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
}
Application.version = '0.0.1';
//# sourceMappingURL=Application.js.map