(function(exports) {
  "use strict";

  var RuntimeContext, Stack;

  Stack = function Stack() {
    this.$ = [];
    this.top = 0;
  };

  Stack.prototype.push = function(value) {
    this.$[this.top++] = value;
  };

  Stack.prototype.pop = function() {
    return this.$[--this.top];
  };

  RuntimeContext = function RuntimeContext() {
    this.stack = new Stack();
    this.frameBase = 0;
  };

  RuntimeContext.prototype.getValue = function(decl) {
    return this.stack[this.frameBase + decl.$index];
  };

  RuntimeContext.prototype.setValue = function(decl, value) {
    this.stack[this.frameBase + decl.$index] = value;
  };

  RuntimeContext.prototype.setReturn = function(value) {
    this.returnValue = value;
  };

  RuntimeContext.prototype.getReturn = function() {
    return this.returnValue;
  };

  RuntimeContext.prototype.pushFrame = function() {
    this.stack.push(this.frameBase);
    this.frameBase = this.stack.top;
  };

  RuntimeContext.prototype.popFrame = function() {
    this.frameBase = this.stack.pop();
  };

  exports.Runtime = function Runtime(ast) {
    // scope
    // symbol table
    // type checking

    // traverse AST
    try {
      ast.execute(new RuntimeContext());
    } catch (e) {
      if (e instanceof NewSyntaxError) {
        console.error(e.message, e.actual, e.expected);
        console.error(e.toString());
      } else {
        console.error(e);
      }
    }
  };
})((module || {exports: {}}).exports);
