import * as _ from 'underscore';

export default class Container {
    protected instances: Map<string, any> = null;
    protected aliasMap: Map<string, string[]> = null;

    public constructor () {
        this.instances = new Map();
        this.aliasMap = new Map();
    }

    public isEmpty (): number {
        return this.instances.size;
    }

    public alias (abstract: string, alias: string) {
        let aliasArray: string[] = this.aliasMap.get(abstract);
        if (!aliasArray) {
            aliasArray = [];
        }
        aliasArray.push(alias);
        this.aliasMap.set(abstract, aliasArray);
    }

    public getAlias (alias: string): string | null {
        let result = null;
        this.aliasMap.forEach((aliasArr: string [], abstract: string) => {
            if (aliasArr.indexOf(alias) > -1) {
                result = abstract;
            }
        });
        return result;
    }

    public bind (abstract: string, concrete: any, shared = false) {
        if (this.instances.get(abstract)) {
            this.instances.delete(abstract);
        }

        if (shared) {
            concrete = {
                instance: concrete.call(this),
                shared: shared
            };
        }
        this.instances.set(abstract, concrete);
        return concrete;
    }

    public make (abstract: string): any {
        let result: string = this.getAlias(abstract) || abstract;
        let concrete = this.instances.get(result);
        if (_.isFunction(concrete)) {
            return concrete.call(this);
        } else if (_.isObject(concrete)) {
            if (concrete.shared) {
                return concrete.instance;
            } else {
                return _.clone(concrete);
            }
        } else {
            return concrete;
        }
        return null;
    }

    public keys (): string[] {
        return _.keys(this.instances);
    }

    public has (prop: string | number): boolean {
        let k: string = `${prop}`;
        return this.instances.has(k);
    }
}
