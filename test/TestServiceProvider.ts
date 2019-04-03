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
        this.app.registerCommand(new TestCommand());
    }
}
