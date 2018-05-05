'use strict';

let LazyStub = function(args, type, {
    metar
} = {}) {
    this.args = args;
    this.type = type;

    let paramMetas = [];

    // resolve args first
    for (let i = 0, n = this.args.length; i < n; i++) {
        paramMetas[i] = getMeta(this.args[i]);
    }

    if (metar) {
        let paramMetas = [];

        // resolve args first
        for (let i = 0, n = this.args.length; i < n; i++) {
            paramMetas[i] = getMeta(this.args[i]);
        }

        this.meta = metar(...paramMetas);
    } else {
        this.meta = {
            type,
            paramMetas
        };
    }
};

LazyStub.prototype.toPlain = function() {
    let params = [];

    // resolve args first
    for (let i = 0, n = this.args.length; i < n; i++) {
        params[i] = toPlain(this.args[i]);
    }

    return {
        type: this.type,
        args: params,
        classType: 'LazyStub'
    };
};

let getMeta = (v) => {
    if (v instanceof LazyStub) return v.meta;
    return v;
};

let toPlain = (v) => {
    if (v instanceof LazyStub) {
        return v.toPlain();
    } else {
        return {
            value: v,
            classType: 'Base'
        };
    }
};

let lazyStuber = (type, options) => {
    return (...args) => {
        return new LazyStub(args, type, options);
    };
};

module.exports = {
    lazyStuber,
    toPlain,
    getMeta
};
