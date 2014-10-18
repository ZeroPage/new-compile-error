(function() {
  "use strict";

  var tokens, ast;

  tokens = require('./src/scanner').Scanner();

  console.log("Tokens: ", tokens);

  ast = require('./src/parser').Parser(tokens.slice());

  console.log("AST: ", ast);
})();
