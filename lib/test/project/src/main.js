import App from './App.vue';
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
import Application from "../../../lib/src";
import VueAdapter from "../../../lib/src/adapters/VueAdapter";
global.main = Application.getInstance({ rootId: 'app', component: App, adapter: VueAdapter });
main.register(TestServiceProvider);
main.run();
//# sourceMappingURL=main.js.map