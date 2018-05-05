'use strict';

let _code_node_id_count = 0;

let prefix = 'code_node-';

/**
 * Normally, when reduce a production, will new a LazyCode object
 *
 * TODO fast way to indicate ancestor-descendant relationship
 */
let LazyCode = function(args, fn, type) {
    this.args = args;
    this.fn = fn;
    this.type = type;

    this.id = prefix + _code_node_id_count++;
};

LazyCode.prototype.getValue = function(runtimeCtx) {
    if (runtimeCtx.hasCacheValue && runtimeCtx.hasCacheValue(this, runtimeCtx)) {
        return runtimeCtx.getCacheValue(this, runtimeCtx);
    }

    return this.execute(runtimeCtx);
};

LazyCode.prototype.execute = function(runtimeCtx) {
    runtimeCtx.onBeforeEvalCode && runtimeCtx.onBeforeEvalCode(this, runtimeCtx);

    // run code
    runtimeCtx.callingStack.push(this);
    let value = this.fn(runtimeCtx, this.args);
    runtimeCtx.callingStack.pop();

    runtimeCtx.onAfterEvalCode && runtimeCtx.onAfterEvalCode(this, value, runtimeCtx);
    return value;
};

let fromPlain = (plainObj, classMap) => {
    if (plainObj.classType === 'Base') return plainObj.value;

    let {
        type,
        args
    } = plainObj;

    let lazyerInst = classMap[type];

    if (typeof lazyerInst !== 'function') {
        throw new Error(`can not found function from type ${type}.`);
    }

    let params = [];
    for (let i = 0, n = args.length; i < n; i++) {
        params[i] = fromPlain(args[i], classMap);
    }

    return lazyerInst(...params);
};

let getValue = (runtimeCtx, v) => {
    if (v instanceof LazyCode) {
        // TODO try-catch and display calling stack information
        return v.getValue(runtimeCtx);
    }
    return v;
};

let lazyer = (fn, type) => {
    return (...args) => {
        return new LazyCode(args, fn, type);
    };
};

module.exports = {
    getValue,
    lazyer,
    fromPlain,
    LazyCode
};
