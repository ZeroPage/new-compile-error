(function(exports) {
  "use strict";

  var Token, SYMBOL_DICTIONARY, WORD_DICTIONARY;

  Token = function Token(token) {
    this.value = token;
  };

  Token.prototype.accept = function(visitor) {
  };

  Token.prototype.is = function(tokenType) {
    return this === tokenType || typeof tokenType === 'function' && this instanceof tokenType ||
      this.tokenTypeIs(tokenType);
  };

  Token.prototype.tokenTypeIs = function(tokenType) {
    return this.getTokenType() === tokenType;
  };

  Token.prototype.getTokenType = function() {
    return this.tokenType;
  };

  Token.Type = function Type(token) {
    Token.apply(this, arguments);
  };

  Token.Type.prototype = new Token();

  Token.Type.prototype.isAssignableFrom = function(type) {
    return (this.value === type.value) ||
      (this.value === 'float' && type.value === 'int');
  };

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
  Token.ASSIGN = new Token('=');

  Token.Identifier = function Identifier(buffer) {
    Token.apply(this, arguments);
  };

  Token.Identifier.prototype = new Token();

  Token.Identifier.prototype.accept = function(visitor) {
    visitor.visitIdentifier(this);
  };

  Token.Keyword = function Keyword(buffer) {
    Token.apply(this, arguments);
  };

  Token.Keyword.prototype = new Token();

  Token.Keyword.FOR = new Token.Keyword('for');
  Token.Keyword.WHILE = new Token.Keyword('while');
  Token.Keyword.IF = new Token.Keyword('if');
  Token.Keyword.ELSE = new Token.Keyword('else');
  Token.Keyword.RETURN = new Token.Keyword('return');

  Token.Operator = function Operator(buffer, tokenType) {
    Token.apply(this, arguments);

    this.tokenType = tokenType;
  };

  Token.Operator.prototype = new Token();

  Token.Operator.AddSub = {};
  Token.Operator.MulDiv = {};

  Token.Operator.prototype.getTokenType = function() {
    return (this.value === '+' || this.value === '-') && Token.Operator.AddSub ||
      (this.value === '*' || this.value === '/') && Token.Operator.MulDiv;
  };

  Token.Operator.Compare = function CompareOperator(buffer) {
    Token.Operator.apply(this, arguments);
  };

  Token.Operator.Compare.prototype = new Token.Operator();

  Token.Number = function NumberToken(buffer) {
    var number = Number(buffer);
    Token.apply(this, [Number.isNaN(number) ? undefined : number]);
  };

  Token.Number.prototype = new Token();

  Token.Number.Integer = function IntegerToken(buffer) {
    Token.Number.apply(this, arguments);
    this.type = Token.Type.INT;
  };

  Token.Number.Integer.prototype = new Token.Number();

  SYMBOL_DICTIONARY = {
    ';': {__TOKEN__: Token.SEMICOLON},
    ',': {__TOKEN__: Token.COMMA},
    '+': {__TOKEN__: new Token.Operator('+')},
    '-': {__TOKEN__: new Token.Operator('-')},
    '*': {__TOKEN__: new Token.Operator('*')},
    '/': {__TOKEN__: new Token.Operator('/')},
    '!': {
      '=': {
        __TOKEN__: new Token.Operator.Compare('!=')
      }
    },
    '>': {
      __TOKEN__: new Token.Operator.Compare('>'),
      '=': {
        __TOKEN__: new Token.Operator.Compare('>=')
      }
    },
    '<': {
      __TOKEN__: new Token.Operator.Compare('<'),
      '=': {
        __TOKEN__: new Token.Operator.Compare('<=')
      }
    },
    '=': {
      __TOKEN__: Token.ASSIGN,
      '=': {
        __TOKEN__: new Token.Operator.Compare('==')
      }
    },
    '(': {__TOKEN__: Token.LPAREN},
    ')': {__TOKEN__: Token.RPAREN},
    '{': {__TOKEN__: Token.LBRACE},
    '}': {__TOKEN__: Token.RBRACE},
    '[': {__TOKEN__: Token.LBRACKET},
    ']': {__TOKEN__: Token.RBRACKET}
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

  WORD_DICTIONARY = {
    'int': Token.Type.INT,
    'float': Token.Type.FLOAT,
    'for': Token.Keyword.FOR,
    'while': Token.Keyword.WHILE,
    'if': Token.Keyword.IF,
    'else': Token.Keyword.ELSE,
    'return': Token.Keyword.RETURN
  };

  Token.WORD = function WORD(buffer) {
    var token = WORD_DICTIONARY[buffer];

    if (!token) {
      token = new Token.Identifier(buffer);
    }

    return token;
  };

  exports.Token = Token;
})((module || {exports:{}}).exports);
