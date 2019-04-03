import * as _ from 'underscore';
import Application from "./Application";

export default class ApplicationProxyHandler {
    private target: Application = null;

    constructor (target: Application = null) {
        this.target = target;
    }

    public get (target: any, prop: string, receiver: any) {
        return prop in this.target ? _.property(prop)(this.target) : this.target.make(prop);
    }

    public set (target: any, prop: string, value: any, receiver: any) {
        return this.target.instance(prop, value);
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
