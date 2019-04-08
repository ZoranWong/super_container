type Closure = Function;
function instanceOf (obj: any, fun: any) {
    return obj instanceof fun;
}

function isClosure (obj: any) {
    return instanceOf(obj, Function);
}
export {Closure, instanceOf, isClosure};
