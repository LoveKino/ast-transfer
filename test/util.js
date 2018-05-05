'use strict';

let {
    buildGrammer,
    compile
} = require('..');
let assert = require('assert');

let quickTest = (bnfText, {
    annotationContext,
    tokenTypes
}, tests) => {
    let {
        grammer,
        lr1table,
        annotations
    } = buildGrammer(bnfText);

    for (let i = 0; i < tests.length; i++) {
        let [text, expected] = tests[i];
        let real = compile(text, {
            grammer,
            lr1table,
            annotations,
            annotationContext,
            tokenTypes
        });
        assert.deepEqual(real, expected);
    }
};

module.exports = {
    quickTest
};
