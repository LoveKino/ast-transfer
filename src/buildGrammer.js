'use strict';

let {
    buildLR1Table
} = require('syntaxer');
let bnfer = require('bnfer');
let pfcCompiler = require('pfc-compiler');

/**
 * build grammer from bfn text
 */

let buildGrammer = (bnfText) => {
    let grammer = bnfer.parse(bnfText);
    let lr1table = buildLR1Table(grammer);
    let prodcutions = grammer.productions;

    let annotations = [];
    for (let i = 0, n = prodcutions.length; i < n; i++) {
        let annotation = prodcutions[i][2];
        if (annotation) {
            annotations[i] = pfcCompiler.parseStrToAst(annotation);
        }
    }
    return {
        lr1table,
        grammer,
        annotations
    };
};

module.exports = buildGrammer;
