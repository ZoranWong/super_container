import * as _ from 'underscore';
function instanceOf(obj, fun) {
    return !!(obj instanceof fun);
}
function isClosure(obj) {
    return instanceOf(obj, Function) && !isClass(obj);
}
function isClass(obj, className = null) {
    let typeName = new RegExp(`$class[\s+]${className}`);
    if (_.isObject(obj)) {
        return typeName.test(obj.toString());
    }
    return false;
}
function end(list) {
    let l = list;
    if (instanceOf(list, Set)) {
        l = Array.from(list);
    }
    return l[l.length - 1];
}
export { instanceOf, isClosure, isClass, end };
//# sourceMappingURL=helper.js.map