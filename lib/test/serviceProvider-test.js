"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../src/Application");
const chai_1 = require("chai");
require("mocha");
const TestServiceProvider_1 = require("./TestServiceProvider");
describe('Test Application Provider and command', () => {
    it('should return true', () => {
        let app = new Application_1.default();
        app.register(TestServiceProvider_1.default);
        app.run();
        app.command('TEST_COMMAND', 'test application provider and command');
        console.log(app.make('dd') === app.make('dd'));
        chai_1.expect(app).to.instanceOf(Application_1.default);
    });
});
//# sourceMappingURL=serviceProvider-test.js.map