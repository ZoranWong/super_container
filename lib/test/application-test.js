"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../src/Application");
const chai_1 = require("chai");
require("mocha");
const Container_1 = require("../src/container/Container");
describe('New Application', () => {
    it('should return true', () => {
        let app = Application_1.default.getInstance();
        chai_1.expect(app).to.instanceOf(Container_1.default);
    });
});
//# sourceMappingURL=application-test.js.map