'use strict';

let _id_context_count = 0;
const prefix = 'runtime-context-';

let RuntimeContext = function(variableMap, parent, {
    onAfterEvalCode,
    hasCacheValue,
    getCacheValue,
    callingStack
} = {}) {
    this.id = prefix + (_id_context_count++);
    this.callingStack = callingStack || [];
    this.onAfterEvalCode = onAfterEvalCode;
    this.hasCacheValue = hasCacheValue;
    this.getCacheValue = getCacheValue;

    this.variableContext = new VariableContext(variableMap, parent);
};

RuntimeContext.prototype.next = function(variableMap) {
    return new RuntimeContext(variableMap, this.variableContext, {
        onAfterEvalCode: this.onAfterEvalCode,
        hasCacheValue: this.hasCacheValue,
        getCacheValue: this.getCacheValue,
        callingStack: this.callingStack
    });
};

let VariableContext = function(variableMap, parent) {
    this.variableMap = variableMap;
    this.parent = parent;
};

VariableContext.prototype.findVariable = function(name) {
    if (this.variableMap.hasOwnProperty(name)) {
        return this.variableMap[name];
    } else {
        if (!this.parent) {
            throw new Error(`missing variable ${name}.`);
        }
        return this.parent.findVariable(name);
    }
};

module.exports = {
    RuntimeContext
};
