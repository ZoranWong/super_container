"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestCommand_1 = require("./TestCommand");
class TestServiceProvider {
    constructor(app) {
        this.app = null;
        this.app = app;
    }
    boot() {
    }
    register() {
        this.app.registerCommand(TestCommand_1.default);
        this.app.singleton('dd', function () {
            return new TestCommand_1.default;
        });
    }
}
exports.default = TestServiceProvider;
//# sourceMappingURL=TestServiceProvider.js.map