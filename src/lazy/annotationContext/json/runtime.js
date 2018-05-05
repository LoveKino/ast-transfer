'use strict';

const {
    lazyer,
    getValue
} = require('../../lazyCode');

module.exports = {
    array: lazyer(function(ctx, args) {
        let params = [];

        // resolve args first
        for (let i = 0, n = args.length; i < n; i++) {
            params[i] = getValue(ctx, args[i]);
        }

        return params;
    }, 'array'),

    object: lazyer(function(ctx, [pairs]) {
        pairs = getValue(ctx, pairs);

        let ret = {};
        if (!pairs) return ret;
        for (let i = 0, n = pairs.length; i < n; i++) {
            let [key, value] = pairs[i];
            ret[key] = value;
        }
        return ret;
    }, 'object')
};
