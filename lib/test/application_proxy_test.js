import Application from "../src/Application";
import 'mocha';
import ApplicationProxyHandler from "../src/ApplicationProxyHandler";
describe('Test Application ApplicationProxyHandler', () => {
    it('should return true', () => {
        let app = new Application();
        let proxy = new Proxy(app, new ApplicationProxyHandler(app));
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