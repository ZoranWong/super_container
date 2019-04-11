import Application from "./Application";
import ApplicationProxyHandler from "./ApplicationProxyHandler";
export default Application;
export function appRun(options) {
    let app = new Application(options);
    let main = new Proxy(app, new ApplicationProxyHandler(app));
    return main;
}
//# sourceMappingURL=index.js.map