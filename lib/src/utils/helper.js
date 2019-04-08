"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
function instanceOf(obj, fun) {
    return !!(obj instanceof fun);
}
exports.instanceOf = instanceOf;
function isClosure(obj) {
    return instanceOf(obj, Function) && !isClass(obj);
}
exports.isClosure = isClosure;
function isClass(obj, className = null) {
    let typeName = new RegExp(`$class[\s+]${className}`);
    if (_.isObject(obj)) {
        return typeName.test(obj.toString());
    }
    return false;
}
exports.isClass = isClass;
function end(list) {
    let l = list;
    if (instanceOf(list, Set)) {
        l = Array.from(list);
    }
    return l[l.length - 1];
}
exports.end = end;
//# sourceMappingURL=helper.js.map