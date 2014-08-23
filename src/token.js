(function() {
  "use strict";

  var Token;

  Token = function Token(token) {
  };

  Token.TYPE_INT = new Token('int');
  Token.TYPE_FLOAT = new Token('float');

  Token.IDENTIFIER = function IDENTIFER(buffer) {
    return new Token(buffer);
  };

  Token.OPERATOR = function OPERATOR(buffer) {
    return new Token(buffer);
  };

  Token.SYMBOL = function SYMBOL(buffer) {
    var obj;
    obj = {
      ';': Token.SEMICOLON,
      ',': Token.COMMA,
      '+': Token.OPERATOR('+'),
      '-': Token.OPERATOR('-'),
      '*': Token.OPERATOR('*'),
      '/': Token.OPERATOR('/'),
      '==': Token.OPERATOR('=='),
      '!=': Token.OPERATOR('!='),
      '>': Token.OPERATOR('>'),
      '<': Token.OPERATOR('<'),
      '>=': Token.OPERATOR('>='),
      '<=': Token.OPERATOR('<=')
    };
  };
})();
