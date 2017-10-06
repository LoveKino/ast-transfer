'use strict';

let {
    ctxFreeGrammer,
    LR
} = require('syntaxer');
let streamTokenSpliter = require('stream-token-parser');
let pfcCompiler = require('pfc-compiler');

let parser = ({
    grammer,
    lr1table,

    annotations,
    annotationContext,

    tokenTypes,
    processTokens = id
}) => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);
    let lrParse = LR(ctxFreeGrammer(grammer), lr1table.ACTION, lr1table.GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode, reducedTokens, pIndex) => {
            let children = midNode.children;

            let params = {};
            for (let i = 0, n = children.length; i < n; i++) {
                let child = children[i];
                let childValue = '';
                if (child.type === 'terminal') {
                    childValue = child.token.text;
                } else {
                    childValue = child.value;
                }

                params[`$${i + 1}`] = childValue;
            }

            let annotation = annotations[pIndex];
            if (annotation) {
                midNode.value = pfcCompiler.executeAST(annotation, Object.assign(params, annotationContext));
            } else {
                //
                midNode.value = reducedTokens;
            }
        }
    });

    return (chunk) => {
        let str = chunk && chunk.toString();
        let tokens = processTokens(tokenSpliter(str));

        for (let i = 0, n = tokens.length; i < n; i++) {
            lrParse(tokens[i]);
        }

        // means finished chunks
        if (chunk === null) {
            let ast = lrParse(null);
            return ast.children[0].value;
        }
    };
};

// for test
let compile = (text, options) => {
    let parse = parser(options);
    parse(text);
    return parse(null);
};

const id = v => v;

module.exports = {
    parser,
    compile
};
