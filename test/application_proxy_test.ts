import Application from "../src/Application";
import { expect } from 'chai';
import 'mocha';
import ApplicationProxyHandler from "../src/ApplicationProxyHandler";

describe('Test Application ApplicationProxyHandler', () => {
    it('should return true', () => {
        let app = new Application();
        let proxy = new Proxy(app, new ApplicationProxyHandler(app))
        proxy.instance('a', {a: 1111});
        // proxy.alias('a', 'ab')
        // proxy.b = 1;
        console.log(proxy.a);
    });
});
