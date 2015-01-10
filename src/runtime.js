(function(exports) {
  "use strict";

  exports.Runtime = function Runtime(ast) {
    // scope
    // symbol table
    // type checking

    // traverse AST
    try {
      ast.execute({});
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
