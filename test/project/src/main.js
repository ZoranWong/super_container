// import Vue from 'vue'
import App from './App.vue'
import Application from "../../../lib/src";
import ApplicationProxyHandler from "../../../lib/src/ApplicationProxyHandler";
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
//
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
let app = new Application({rootId: 'app', component: App});
const main = new Proxy(app, new ApplicationProxyHandler(app));
// const main = new Application('app', App);
main.register(TestServiceProvider);
main.run();
// main.command('TEST_COMMAND', 'test super container command')
