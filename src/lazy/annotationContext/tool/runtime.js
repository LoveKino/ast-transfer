'use strict';

const {
    lazyer,
    getValue
} = require('../../lazyCode');

module.exports = {
    appendTo: lazyer((ctx, [v, list]) => {
        v = getValue(ctx, v);
        list = getValue(ctx, list);
        return [v].concat(list);
    }, 'appendTo'),

    lookupVariable: lazyer((ctx, [name]) => {
        return ctx.variableContext.findVariable(name);
    }, 'lookupVariable'),

    condition: lazyer(function(ctx, [c, e1, e2]) {
        if (getValue(ctx, c)) {
            return getValue(ctx, e1);
        } else {
            return getValue(ctx, e2);
        }
    }, 'condition'),

    applyFun: lazyer(function(ctx, [fun, args]) {
        fun = getValue(ctx, fun);
        args = getValue(ctx, args);

        return fun(...args);
    }, 'applyFun'),

    abstraction: lazyer((ctx, [variableNames, e]) => {
        variableNames = getValue(ctx, variableNames);
        let varLen = variableNames.length;

        return (...args) => {
            let variableMap = {};
            for (let i = 0; i < varLen; i++) {
                variableMap[variableNames[i]] = args[i];
            }

            return getValue(ctx.next(variableMap), e);
        };
    }, 'abstraction')
};
