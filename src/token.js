(function(exports) {
  "use strict";

  var Token, SYMBOL_DICTIONARY;

  Token = function Token(token) {
    this.value = token;
  };

  Token.Type = function Type(token) {
    Token.apply(this, arguments);
  };

  Token.Type.prototype = new Token();

  Token.Type.INT = new Token.Type('int');
  Token.Type.FLOAT = new Token.Type('float');

  Token.SEMICOLON = new Token(';');
  Token.COMMA = new Token(',');

  Token.LPAREN = new Token('(');
  Token.RPAREN = new Token(')');
  Token.LBRACE = new Token('{');
  Token.RBRACE = new Token('}');
  Token.LBRACKET = new Token('[');
  Token.RBRACKET = new Token(']');

  Token.Identfiier = function Identifier(buffer) {
    Token.apply(this, arguments);
  };

  Token.Identfiier.prototype = new Token();

  Token.OPERATOR = function OPERATOR(buffer) {
    return new Token(buffer);
  };

  Token.NUMBER_INT = function NUMBER_INT(buffer) {
    return new Token(Number(buffer));
  };

  SYMBOL_DICTIONARY = {
    ';': {__TOKEN__: new Token.SEMICOLON()},
    ',': {__TOKEN__: new Token.COMMA()},
    '+': {__TOKEN__: new Token.OPERATOR('+')},
    '-': {__TOKEN__: new Token.OPERATOR('-')},
    '*': {__TOKEN__: new Token.OPERATOR('*')},
    '/': {__TOKEN__: new Token.OPERATOR('/')},
    '!': {
      '=': {
        __TOKEN__: new Token.OPERATOR('!=')
      }
    },
    '>': {
      __TOKEN__: new Token.OPERATOR('>'),
      '=': {
        __TOKEN__: new Token.OPERATOR('>=')
      }
    },
    '<': {
      __TOKEN__: new Token.OPERATOR('<'),
      '=': {
        __TOKEN__: new Token.OPERATOR('<=')
      }
    },
    '=': {
      __TOKEN__: new Token.OPERATOR('='),
      '=': {
        __TOKEN__: new Token.OPERATOR('==')
      }
    },
    '(': {
      __TOKEN__: new Token.LPAREN()
    },
    ')': {
      __TOKEN__: new Token.RPAREN()
    },
    '{': {
      __TOKEN__: new Token.LBRACE()
    },
    '}': {
      __TOKEN__: new Token.RBRACE()
    },
    '[': {
      __TOKEN__: new Token.LBRACKET()
    },
    ']': {
      __TOKEN__: new Token.RBRACKET()
    }
  };

  Token.SYMBOL_OBJ = function SYMBOL_OBJ(buffer) {
    var i, obj = SYMBOL_DICTIONARY;

    for (i = 0; i < buffer.length; i++) {
      obj = obj[buffer[i]];

      if (!obj) {
        return undefined;
      }
    }

    return obj;
  };

  Token.SYMBOL = function SYMBOL(buffer) {
    var obj = Token.SYMBOL_OBJ(buffer);

    return obj && obj.__TOKEN__;
  };

  exports.Token = Token;
})((module || {exports:{}}).exports);
