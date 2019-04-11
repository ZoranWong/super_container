import App from './App.vue';
import TestServiceProvider from "../../../lib/test/TestServiceProvider";
import { appRun } from "../../../lib/src";
const main = appRun({ rootId: 'app', component: App });
main.register(TestServiceProvider);
main.run();
//# sourceMappingURL=main.js.map