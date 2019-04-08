import Application from "../src/Application";
import { expect } from 'chai';
import 'mocha';
import TestServiceProvider from "./TestServiceProvider";

describe('Test Application Provider and command', () => {
    it('should return true', () => {
        let app = new Application();
        // app.register(TestServiceProvider);
       // app.run();
       // app.command('TEST_COMMAND', 'test application provider and command');
        // expect(app).to.instanceOf(Application);
    });
});
