'use strict';

let {
    jsonNumberExpStr,
} = require('cl-fsm/lib/commonTokenReg');
let {
    buildFSM
} = require('stream-token-parser');
let {
    quickTest
} = require('./util');

describe('index', () => {
    it('base', () => {
        quickTest(`
        E := num @ exp($1)
        `,

            {
                annotationContext: {
                    exp: v => Number(v)
                },
                tokenTypes: [{
                    name: 'num',
                    match: buildFSM(jsonNumberExpStr),
                    priority: 1
                }]
            }, [
                ['123', 123],
                ['876', 876]
            ]);
    });

    it('add', () => {
        quickTest(`E := num + num @add($1, $3)
        `,

            {
                annotationContext: {
                    add: (v1, v2) => {
                        return Number(v1) + Number(v2);
                    }
                },
                tokenTypes: [{
                    name: 'num',
                    match: buildFSM(jsonNumberExpStr),
                    priority: 1
                }, {
                    name: '+',
                    match: '+',
                    priority: 1
                }]
            }, [
                ['5+6', 11],
                ['8+9', 17]
            ]);
    });

    it('math', () => {
        quickTest(`E := E + num @add($1, number($3))
                    |   E - num @subtraction($1, number($3))
                    |   num @number($1)
        `,

            {
                annotationContext: {
                    add: (v1, v2) => v1 + v2,
                    subtraction: (v1, v2) => {
                        return v1 - v2;
                    },
                    number: (v) => Number(v)
                },
                tokenTypes: [{
                    name: 'num',
                    match: buildFSM(jsonNumberExpStr),
                    priority: 1
                }, {
                    name: '+',
                    match: '+',
                    priority: 2
                }, {
                    name: '-',
                    match: '-',
                    priority: 2
                }]
            }, [
                ['5+6-2', 9],
                ['8-1-1+9', 15]
            ]);
    });
});
