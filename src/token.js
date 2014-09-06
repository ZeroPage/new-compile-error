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

  Token.

  Token.SYMBOL = function SYMBOL(buffer) {
    var obj;
    obj = {
      ';': {__TOKEN__: Token.SEMICOLON},
      ',': {__TOKEN__: Token.COMMA},
      '+': {__TOKEN__: Token.OPERATOR('+')},
      '-': {__TOKEN__: Token.OPERATOR('-')},
      '*': {__TOKEN__: Token.OPERATOR('*')},
      '/': {__TOKEN__: Token.OPERATOR('/')},
      '!': {
        '=': {
          __TOKEN__: Token.OPERATOR('!=')
        }
      },
      '>': {
        __TOKEN__: Token.OPERATOR('>'),
        '=': {
          __TOKEN__: Token.OPERATOR('>=')
        }
      },
      '<': {
        __TOKEN__: Token.OPERATOR('<'),
        '=': {
          __TOKEN__: Token.OPERATOR('<=')
        }
      },
      '=': {
        __TOKEN__: Token.OPERATOR('='),
        '=': {
          __TOKEN__: Token.OPERATOR('==')
        }
      }
    };
  };
})();
