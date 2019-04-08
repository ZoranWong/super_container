"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./container/Container");
class Application extends Container_1.default {
    constructor() {
        super();
        this.providersContainer = null;
        this.showingPageObject = null;
        this.configs = null;
        this.dispatcher = null;
        this.commandPrefix = 'COMMAND:';
        this.providersContainer = new Set();
        this.configs = new Map();
        this.dispatcher = this.configs.get('app.dispatcher');
    }
    command(name, ...paramters) {
        let command = this.make(this.commandName(name));
        return command.handle.call(this.showingPageObject, paramters);
    }
    commandName(name) {
        return this.commandPrefix + name;
    }
    register(serviceProvider) {
        let provider = new serviceProvider(this);
        this.providersContainer.add(provider);
    }
    registerCommand(command) {
        command = new command(this);
        this.singleton(this.commandName(command.commandName()), function () {
            return command;
        });
    }
    pageChange(route) {
        this.showingPageObject = this.make(this.pageKey(route));
    }
    addPage(route, pageObject) {
        let adapter = this.configs.get('app.pageAdapter');
        this.singleton(this.pageKey(route), new adapter(pageObject));
    }
    pageKey(route) {
        return 'page:' + route;
    }
    run() {
        this.providersContainer.forEach((provider) => {
            if ('register' in provider)
                provider.register();
        });
    }
}
Application.version = '0.0.1';
exports.default = Application;
//# sourceMappingURL=Application.js.map