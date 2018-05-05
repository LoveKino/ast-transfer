'use strict';

const {
    getValue,
    lazyer
} = require('../../lazyCode');

const defCreateNode = (tagName, props, children) => {
    return {
        tagName,
        props,
        children
    };
};

module.exports = ({
    createNode = defCreateNode
} = {}) => {
    return {
        xmlNode: lazyer((ctx, [xmlClass, props, children]) => {
            props = getValue(ctx, props);
            children = getValue(ctx, children);
            return createNode(xmlClass, props, children);
        }, 'xmlNode')
    };
};
