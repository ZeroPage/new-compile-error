(function(exports) {
  "use strict";

  var Token, SYMBOL_DICTIONARY;

  Token = function Token(token) {
    this.value = token;
  };

  Token.TYPE_INT = new Token('int');
  Token.TYPE_FLOAT = new Token('float');

  Token.SEMICOLON = new Token(';');
  Token.COMMA = new Token(',');

  Token.LPAREN = new Token('(');
  Token.RPAREN = new Token(')');
  Token.LBRACE = new Token('{');
  Token.RBRACE = new Token('}');
  Token.LBRACKET = new Token('[');
  Token.RBRACKET = new Token(']');

  Token.IDENTIFIER = function IDENTIFER(buffer) {
    return new Token(buffer);
  };

  Token.OPERATOR = function OPERATOR(buffer) {
    return new Token(buffer);
  };

  Token.NUMBER_INT = function NUMBER_INT(buffer) {
    return new Token(Number(buffer));
  };

  SYMBOL_DICTIONARY = {
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
    },
    '(': {
      __TOKEN__: Token.LPAREN
    },
    ')': {
      __TOKEN__: Token.RPAREN
    },
    '{': {
      __TOKEN__: Token.LBRACE
    },
    '}': {
      __TOKEN__: Token.RBRACE
    },
    '[': {
      __TOKEN__: Token.LBRACKET
    },
    ']': {
      __TOKEN__: Token.RBRACKET
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
