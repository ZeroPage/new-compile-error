(function(exports) {
  "use strict";

  var Token, SYMBOL_DICTIONARY, WORD_DICTIONARY, Position;

  Token = function Token(token) {
    if (token instanceof Token) {
      this.value = token.value;
      this.token = token;
    } else {
      this.value = token;
    }
  };

  Token.prototype.accept = function(visitor) {
  };

  Token.prototype.is = function(tokenType) {
    return this === tokenType ||
      typeof tokenType === 'function' && this instanceof tokenType ||
      tokenType.isPrototypeOf(this) ||
      this.tokenTypeIs(tokenType);
  };

  Token.prototype.tokenTypeIs = function(tokenType) {
    return this.getTokenType() === tokenType;
  };

  Token.prototype.getTokenType = function() {
    return this.tokenType;
  };

  Token.prototype.toString = function() {
    return this.value;
  };

  Token.Position = function Position(line, column, source) {
    this.line = line;
    this.column = column;
    this.source = source;
  };

  Token.Position.prototype.toString = function() {
    var source = this.source.split('\n')[this.line - 1];
    var mark = new Array(this.column).join(' ') + '^';
    return "Line " + this.line + ", Column " + this.column + '\n' + source + '\n' + mark;
  };

  var Type = function Type(token, cast) {
    Token.apply(this, arguments);

    this.cast = cast;
  };

  Type.prototype = new Token();

  Type.prototype.isAssignableFrom = function(type) {
    return (this === type) || type.isPrototypeOf(this) || this.isPrototypeOf(type) || Object.getPrototypeOf(this) === Object.getPrototypeOf(type) ||
      (
        (this === Token.Type.FLOAT || Token.Type.FLOAT.isPrototypeOf(this)) &&
        (type === Token.Type.INT || Token.Type.INT.isPrototypeOf(type))
      );
  };

  Type.prototype.getTokenType = function() {
    return Token.Type;
  };

  Type.FunctionType = function FunctionType(token) {
    Type.apply(this, arguments);
  };

  Type.FunctionType.prototype = new Type();

  Type.FunctionType.prototype.isAssignableFrom = function(type) {
    return false;
  };

  Type.FunctionType.prototype.getTokenType = function() {
    return Token.Type.FunctionType;
  };

  Token.Type = {};
  Token.Type.INT = new Type('int', parseInt);
  Token.Type.FLOAT = new Type('float', parseFloat);
  Token.Type.VOID = new Type('void');

  Token.Type.FunctionType = {};
  Token.Type.FunctionType[Token.Type.INT] = new Type.FunctionType(Token.Type.INT);
  Token.Type.FunctionType[Token.Type.FLOAT] = new Type.FunctionType(Token.Type.FLOAT);
  Token.Type.FunctionType[Token.Type.VOID] = new Type.FunctionType(Token.Type.VOID);

  Token.SEMICOLON = new Token(';');
  Token.COMMA = new Token(',');

  Token.LPAREN = new Token('(');
  Token.RPAREN = new Token(')');
  Token.LBRACE = new Token('{');
  Token.RBRACE = new Token('}');
  Token.LBRACKET = new Token('[');
  Token.RBRACKET = new Token(']');
  Token.ASSIGN = new Token('=');

  Token.EOF = function EOF() {
    Token.apply(this, arguments);
  };

  Token.EOF.prototype = new Token();

  Token.Identifier = function Identifier(buffer) {
    Token.apply(this, arguments);
  };

  Token.Identifier.prototype = new Token();

  Token.Identifier.prototype.accept = function(visitor) {
    visitor.visitIdentifier(this);
  };

  Token.Identifier.prototype.evaluate = function(context) {
    return context.getValue(this.decl);
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

  Token.Operator = function Operator(buffer, operate) {
    Token.apply(this, arguments);

    this._operate = operate;
  };

  Token.Operator.prototype = new Token();

  Token.Operator.prototype.operate = function() {
    return this._operate.apply(this, arguments);
  };

  Token.Operator.AddSub = {};
  Token.Operator.MulDiv = {};

  Token.Operator.prototype.getTokenType = function() {
    return (this.value === '+' || this.value === '-') && Token.Operator.AddSub ||
      (this.value === '*' || this.value === '/') && Token.Operator.MulDiv;
  };

  Token.Operator.Compare = function CompareOperator(buffer, compare) {
    Token.Operator.apply(this, [arguments[0]]);

    this._compare = compare;
  };

  Token.Operator.Compare.prototype = new Token.Operator();

  Token.Operator.Compare.prototype.operate = function() {
    return this._compare.apply(this, arguments) ? 1 : 0;
  };

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

  Token.Number.Integer.prototype.evaluate = function(context) {
    return parseInt(this.value);
  };

  Token.Number.Float = function FloatToken(buffer) {
    Token.Number.apply(this, arguments);

    this.type = Token.Type.FLOAT;
  };

  Token.Number.Float.prototype = new Token.Number();

  Token.Number.Float.prototype.evaluate = function(context) {
    return parseFloat(this.value);
  };

  SYMBOL_DICTIONARY = {
    ';': {__TOKEN__: Token.SEMICOLON},
    ',': {__TOKEN__: Token.COMMA},
    '+': {__TOKEN__: new Token.Operator('+', function(a, b) {
      return a + b;
    })},
    '-': {__TOKEN__: new Token.Operator('-', function(a, b) {
      return a - b;
    })},
    '*': {__TOKEN__: new Token.Operator('*', function(a, b) {
      return a * b;
    })},
    '/': {__TOKEN__: new Token.Operator('/', function(a, b) {
      return a / b;
    })},
    '!': {
      '=': {
        __TOKEN__: new Token.Operator.Compare('!=', function(a, b) {
          return a !== b;
        })
      }
    },
    '>': {
      __TOKEN__: new Token.Operator.Compare('>', function(a, b) {
        return a > b;
      }),
      '=': {
        __TOKEN__: new Token.Operator.Compare('>=', function(a, b) {
          return a >= b;
        })
      }
    },
    '<': {
      __TOKEN__: new Token.Operator.Compare('<', function(a, b) {
        return a < b;
      }),
      '=': {
        __TOKEN__: new Token.Operator.Compare('<=', function(a, b) {
          return a <= b;
        })
      }
    },
    '=': {
      __TOKEN__: Token.ASSIGN,
      '=': {
        __TOKEN__: new Token.Operator.Compare('==', function(a, b) {
          return a === b;
        })
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
