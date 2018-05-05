'use strict';

let ignore = (blackSet = {}) => (tokens) => {
    let ret = [];
    for (let i = 0, n = tokens.length; i < n; i++) {
        let name = tokens[i].name;
        if (!blackSet[name]) {
            ret.push(tokens[i]);
        }
    }

    return ret;
};

module.exports = {
    ignore
};
