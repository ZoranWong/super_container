import Application from "../src/Application";
import { expect } from 'chai';
import 'mocha';
import Container from "../src/container/Container";
// import  Vue from 'vue';
// import VueRouter from 'vue-router';
describe('New Application', () => {
    it('should return true', () => {
        let app = Application.getInstance();
        // console.log(Vue, VueRouter);
        expect(app).to.instanceOf(Container);
    });
});

