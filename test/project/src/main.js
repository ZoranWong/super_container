// import Vue from 'vue'
import App from './App.vue'
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
import {appRun} from "../../../lib/src";
//
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
const main = appRun({rootId: 'app', component: App});
// const main = new Application('app', App);
main.register(TestServiceProvider);
main.run();
// main.command('TEST_COMMAND', 'test super container command')
