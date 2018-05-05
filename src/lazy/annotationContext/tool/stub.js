'use strict';

const {
    lazyStuber
} = require('../../lazyStub');

module.exports = {
    id: v => v,
    appendTo: lazyStuber('appendTo'),
    lookupVariable: lazyStuber('lookupVariable'),
    condition: lazyStuber('condition'),
    applyFun: lazyStuber('applyFun'),

    // TODO check names
    abstraction: lazyStuber('abstraction')
};
