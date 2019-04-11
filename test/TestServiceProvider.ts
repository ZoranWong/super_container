import ServiceProvider from "../src/support/ServiceProvider";
import Application from "../src/Application";
import TestCommand from "./TestCommand";

export default class TestServiceProvider extends ServiceProvider {

    boot (): void {
        console.log('TestServiceProvider boot!');
    }

    register (): void {
        this.app.registerCommand(TestCommand);
        this.app.singleton('dd', function () {
            return new TestCommand;
        });
    }
}
