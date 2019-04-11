import App from './App.vue';
import Application from "../../../lib/src";
import ApplicationProxyHandler from "../../../lib/src/ApplicationProxyHandler";
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
let app = new Application('app', App);
const main = new Proxy(app, new ApplicationProxyHandler(app));
main.register(TestServiceProvider);
main.run();
//# sourceMappingURL=main.js.map