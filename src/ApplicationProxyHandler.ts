import * as _ from 'underscore';
import Application from "./Application";
import ApplicationOptions from "./types/ApplicationOptions";

export default class ApplicationProxyHandler {
    private target: Application = null;
    public proxy: any = null;
    private static instance: ApplicationProxyHandler =  null;

    private  constructor (target: ApplicationOptions = {rootId: 'id', component: null}) {
        this.target = new Application(target);
        this.proxy = new Proxy(this.target, this);
    }
    public static getInstance(target: ApplicationOptions = {rootId: 'id', component: null}): any {
        if(!ApplicationProxyHandler.instance){
            let instance = new ApplicationProxyHandler(target);
            ApplicationProxyHandler.instance = instance;
        }
        return ApplicationProxyHandler.instance.proxy;
    }
    public get (target: any, prop: string, receiver: any) {
        return prop in this.target ? _.property(prop)(this.target) : this.target.make(prop);
    }

    public set (target: any, prop: string, value: any, receiver: any) {
        let tmp = {};
        Object.defineProperty(tmp, prop, {
            get (): any {
                return value;
            },
            enumerable: true
        });
        return prop in this.target ? (_.extend(this.target, tmp)) : this.target.instance(prop, value);
    }

    public enumerate (target: any): PropertyKey[] {
        return this.target.keys();
    }

    public has (target: any, p: string | number): boolean {
        return this.target.has(p);
    }

    public isExtensible (target: any): boolean {
        return true;
    }

    public ownKeys (target: any): PropertyKey[] {
        return _.keys(this.target || target);
    }
}
