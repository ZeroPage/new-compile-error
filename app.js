(function() {
  "use strict";

  var tokens, ast;

  tokens = require('./src/scanner').Scanner();

  console.log(tokens);

  ast = require('./src/parser').Parser(tokens);
})();
