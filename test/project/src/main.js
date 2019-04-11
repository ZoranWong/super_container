// import Vue from 'vue'
import App from './App.vue'
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
import Application from "../../../lib/src";
const main = Application.getInstance({rootId: 'app', component: App});
main.register(TestServiceProvider);
main.run();
