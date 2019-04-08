"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../src/Application");
require("mocha");
const ApplicationProxyHandler_1 = require("../src/ApplicationProxyHandler");
describe('Test Application ApplicationProxyHandler', () => {
    it('should return true', () => {
        let app = new Application_1.default();
        let proxy = new Proxy(app, new ApplicationProxyHandler_1.default(app));
        let instance = { a: 1111 };
        proxy.resolving('b', () => {
            console.log('now begin to create a instance');
        });
        proxy.afterResolving('b', function () {
            console.log('builded a instance');
        });
        proxy.instance('a', instance);
        proxy.singleton('b', instance);
        console.log('test get from proxy', proxy.b);
    });
});
//# sourceMappingURL=application_proxy_test.js.map