'use strict';

const {
    lazyStuber
} = require('../../lazyStub');

module.exports = {
    xmlNode: lazyStuber('xmlNode', {
        metar: (xmlClass, props, children, closexmlClass) => {
            if (xmlClass !== closexmlClass) {
                throw new Error(`xml tag does not close correctly. start tag is ${xmlClass}, close tag is ${closexmlClass}`);
            }
        }
    }),

    // >text...</
    parseXmlCharTextWithInnerBracket: (text) => {
        return text.substring(1, text.length - 2).trim();
    }
};
