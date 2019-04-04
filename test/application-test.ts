import Application from "../src/Application";
import { expect } from 'chai';
import 'mocha';
import Container from "../src/container/Container";

describe('New Application', () => {
    it('should return true', () => {
        let app = new Application();
        expect(app).to.instanceOf(Container);
    });
});

