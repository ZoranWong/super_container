import ServiceProvider from "../src/support/ServiceProvider";
import TestCommand from "./TestCommand";
export default class TestServiceProvider extends ServiceProvider {
    boot() {
        console.log('TestServiceProvider boot!');
    }
    register() {
        this.app.registerCommand(TestCommand);
        this.app.singleton('dd', function () {
            return new TestCommand;
        });
    }
}
//# sourceMappingURL=TestServiceProvider.js.map