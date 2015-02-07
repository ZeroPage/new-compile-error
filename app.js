(function() {
  "use strict";

  var tokens, ast, semantic;

  tokens = require('./src/scanner').Scanner();

  console.log("Tokens: ", tokens);

  ast = require('./src/parser').Parser(tokens.slice());

  console.log("AST: ", ast);

  require('./src/semantic').Analyzer(ast);

  require('./src/linker').Linker(ast);

  require('./src/runtime').Runtime(ast);
})();
