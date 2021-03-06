(function(exports) {
  'use strict';

  var Scanner, CharScanner, Token, Position, NewSyntaxError;

  Token = require('./token').Token;
  NewSyntaxError = require('./error').NewSyntaxError;

  Position = function Position(source) {
    Token.Position.apply(this, [1, 1, source]);
  };

  Position.prototype = new Token.Position();

  Position.prototype.current = function() {
    return new Token.Position(this.line, this.column, this.source);
  };

  Position.prototype.nextLine = function() {
    this.line++;
    this.column = 1;
  };

  Position.prototype.nextColumn = function() {
    this.column++;
  };

  function FILTER_BY_TYPE(type) {
    return function(element) {
      return element.type === type;
    };
  }

  var getScripts = function(type) {
    var i, scripts = [], filter = FILTER_BY_TYPE(type),
        elements = document.getElementsByTagName('script');
    for (i = 0; i < elements.length; i++) {
      if (filter(elements[i])) {
        scripts.push(elements[i]);
      }
    }
    return scripts;
  };

  CharScanner = function CharScanner(scripts) {
    var i;

    if (!scripts) {
        throw new Error('script element(s) required');
    }

    if (!scripts || scripts.length === undefined) {
      scripts = [scripts];
    }

    this.buffer = [];
    this.consumed = [];

    for (i = 0; i < scripts.length; i++) {
      this.scanScript(scripts[i]);
    }

    this.position = new Position(this.buffer.join(''));
  };

  CharScanner.prototype.scanScript = function(script) {
    if (!script || script.tagName.toUpperCase() !== 'SCRIPT' || !script.src && !/[^\s]/.test(script.innerText)) {
      throw new Error('script element is invalid');
    }
    var buffer = script.innerText.replace(/\r\n?/g, '\n').split('');
    if (buffer[0] === '\n') {
      buffer.shift();
    }
    this.buffer = this.buffer.concat(buffer);

    this.char = this.buffer[0];
  };

  CharScanner.prototype.nextChar = function() {
    return this.buffer.length > 0;
  };

  CharScanner.prototype.readChar = function() {
    if(this.isEOL()) {
      this.position.nextLine();
    } else {
      this.position.nextColumn();
    }

    var char = this.buffer.shift();
    this.consumed.push(char);
    this.char = this.buffer[0];

    return char;
  };

  CharScanner.prototype.pushback = function(length) {
    if (length === 0) {
      return;
    }

    if (length > 1) {
      throw new Error("cannot pushback two or more characters");
    }

    if (this.position.column - length < 0) {
      throw new Error("cannot pushback to previous line");
    }

    this.position.column--;

    this.buffer.unshift(this.consumed.pop());
    this.char = this.buffer[0];
  };

  CharScanner.prototype.isAlpha = function() {
    return (this.char >= 'a' && this.char <= 'z') ||
           (this.char >= 'A' && this.char <= 'Z');
  };

  CharScanner.prototype.isDigit = function() {
    return this.char >= '0' && this.char <= '9';
  };

  CharScanner.prototype.isPoint = function() {
    return this.char === '.';
  };

  CharScanner.prototype.isIdentifierStartChar = function() {
    return this.isAlpha() || this.char === '_';
  };

  CharScanner.prototype.isIdentifierChar = function() {
    return this.isAlpha() || this.isDigit() || this.char === '_';
  };

  CharScanner.prototype.isWhitespace = function() {
    return this.char === ' ' || this.char === '\t' || this.char === '\n' || this.char === '\r';
  };

  CharScanner.prototype.isDquote = function() {
    return this.char === '"';
  };

  CharScanner.prototype.isSlash = function() {
    return this.char === '/';
  };

  CharScanner.prototype.isEscape = function() {
    return this.char === '\\';
  };

  CharScanner.prototype.isEOL = function() {
    return this.char === '\n';
  };

  Scanner = function Scanner() {
    var char, buffer, token, charScanner, selectedToken, selectedBuffer, scripts, obj, tokens, toEscape;

    scripts = getScripts('text/minic');

    charScanner = new CharScanner(scripts);

    tokens = [];

    while (charScanner.nextChar()) {
      buffer = '';
      var position = charScanner.position.current();

      // IDENTIFIER || TYPE_INT || TYPE_FLOAT || TYPE_STRING || KEYWORD
      if (charScanner.isIdentifierStartChar()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar() && charScanner.isIdentifierChar()) {
          buffer += charScanner.readChar();
        }
        
        token = Token.WORD(buffer);
      // NUMBER_INT || NUMBER_FLOAT
      } else if (charScanner.isDigit()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar() && charScanner.isDigit()) {
          buffer += charScanner.readChar();
        }

        if (charScanner.nextChar() && charScanner.isPoint()) {
          buffer += charScanner.readChar();

          while (charScanner.nextChar() && charScanner.isDigit()) {
            buffer += charScanner.readChar();
          }
          token = new Token.Number.Float(buffer);
        } else {
          token = new Token.Number.Integer(buffer);
        }
      } else if (charScanner.isWhitespace()) {
        charScanner.readChar();
        while (charScanner.nextChar() && charScanner.isWhitespace()) {
          charScanner.readChar();
        }
        token = null;
      // STRING
      } else if (charScanner.isDquote()) {
        charScanner.readChar();
        while (charScanner.nextChar() &&
            !charScanner.isEOL() &&
            !charScanner.isDquote()) {
          if (charScanner.isEscape()) {
            charScanner.readChar();
            if (charScanner.nextChar()) {
              toEscape = charScanner.readChar();
              buffer += toEscape
                .replace('\n', '')
                .replace('n', '\n')
                .replace('t', '\t');
            }
          } else {
            buffer += charScanner.readChar();
          }
        }
        token = new Token.String(buffer);
        if (!charScanner.isDquote()) {
          throw new NewSyntaxError("missing character \"", token);
        }
        charScanner.readChar();
      // SYMBOL
      } else {
        buffer += charScanner.readChar();
        // SINGLE LINE COMMENT
        if (buffer[buffer.length-1] === '/' && charScanner.isSlash()) {
          buffer = buffer.slice(0, -1);
          while (!charScanner.isEOL()) {
            charScanner.readChar();
          }
        }
        obj = Token.SYMBOL_OBJ(buffer);
        selectedToken = token = Token.SYMBOL(buffer);
        selectedBuffer = buffer;

        while (charScanner.nextChar() && obj instanceof Object && Object.keys(obj).length > 1) {
          buffer += charScanner.readChar();
          obj = Token.SYMBOL_OBJ(buffer);
          token = Token.SYMBOL(buffer);
          if (token) {
            selectedToken = token;
            selectedBuffer = buffer;
          }
        }
        charScanner.pushback(buffer.length - selectedBuffer.length);
        token = selectedToken;
      }

      if (token) {
        token = Object.create(token);
        token.position = position;
        tokens.push(token);
      }
    }
    token = Object.create(new Token.EOF());
    token.position = charScanner.position.current();
    tokens.push(token);

    return tokens;
  };

  exports.Scanner = Scanner;
})((module || {exports:{}}).exports);
