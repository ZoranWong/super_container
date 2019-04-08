import * as _ from 'underscore';

type Closure = Function;

function instanceOf (obj: any, fun: any): boolean {
    return !!(obj instanceof fun);
}

function isClosure (obj: any): boolean {
    return instanceOf(obj, Function) && !isClass(obj);
}

function isClass (obj: any, className: string = null): boolean {
    let typeName = new RegExp(`$class[\s+]${className}`);
    if (_.isObject(obj)) {
        return typeName.test(obj.toString());
    }
    return false;
}

function end (list: any[]|Set<any>): any {
    let l: any = list;
    if(instanceOf(list, Set)) {
        l = Array.from(list);
    }
    return l[l.length - 1];
}

export {Closure, instanceOf, isClosure, isClass, end};
