import ServiceProviderInterface from "../src/contracts/ServiceProviderInterface";
import Application from "../src/Application";
import TestCommand from "./TestCommand";

export default class TestServiceProvider implements ServiceProviderInterface {
    app: Application = null;

    constructor (app: Application) {
        this.app = app;
    }

    boot (): void {
    }

    register (): void {
        this.app.registerCommand(TestCommand);
        this.app.singleton('dd', function () {
            return new TestCommand;
        });
    }
}
