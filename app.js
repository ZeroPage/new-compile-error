(function() {
  "use strict";

  var tokens, ast, semantic, error;

  error = require('./src/error');

  try {

    tokens = require('./src/scanner').Scanner();

    console.log("Tokens: ", tokens);

    ast = require('./src/parser').Parser(tokens.slice());

    console.log("AST: ", ast);

    require('./src/semantic').Analyzer(ast);

    require('./src/linker').Linker(ast);

    require('./src/runtime').Runtime(ast);

  } catch (e) {
    if (e instanceof error.NewSyntaxError) {
      console.error(e.message, e.actual, e.expected);
      console.error(e.toString());
    } else if (e instanceof error.NewRuntimeError) {
      console.error(e.message);
      console.error(e.toString());
    } else {
      console.error(e);
    }
  }
})();
