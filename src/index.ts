import Application from "./Application";
import ApplicationOptions from "./types/ApplicationOptions";
import ApplicationProxyHandler from "./ApplicationProxyHandler";

export default Application;
export function appRun (options: ApplicationOptions) {
    let app = new Application(options);
    let main = new Proxy(app, new ApplicationProxyHandler(app));
    return main;
}
