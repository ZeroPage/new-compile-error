(function(exports) {
  'use strict';

  var Scanner, CharScanner, Token;

  Token = require('./token').Token;

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
  };

  CharScanner.prototype.scanScript = function(script) {
    if (!script || script.tagName.toUpperCase() !== 'SCRIPT' || !script.src && !/[^\s]/.test(script.innerText)) {
      throw new Error('script element is invalid');
    }

    this.buffer = this.buffer.concat(script.innerText.split(''));
  };

  CharScanner.prototype.nextChar = function() {
    return this.buffer.length > 0;
  };

  CharScanner.prototype.readChar = function() {
    var char = this.buffer.shift();
    this.consumed.push(char);
    this.char = this.buffer[0];
    return char;
  };

  CharScanner.prototype.pushback = function(length) {
    var i;

    if (typeof length === 'number') {
      for (i = 0; i < length; i++) {
        this.pushback();
      }
      return;
    }
    var char = this.consumed.pop();
    this.buffer.unshift(char);
    this.char = char;
  };

  CharScanner.prototype.isAlpha = function() {
    return (this.char >= 'a' && this.char <= 'z') ||
           (this.char >= 'A' && this.char <= 'Z');
  };

  CharScanner.prototype.isDigit = function() {
    return this.char >= '0' && this.char <= '9';
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

  Scanner = function Scanner() {
    var char, buffer, token, charScanner, selectedToken, selectedBuffer, scripts, obj, tokens;

    scripts = getScripts('text/minic');

    charScanner = new CharScanner(scripts);

    tokens = [];

    while (charScanner.nextChar()) {
      buffer = '';

      // IDENTIFIER || TYPE_INT || TYPE_FLOAT || KEYWORD
      if (charScanner.isIdentifierStartChar()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar() && charScanner.isIdentifierChar()) {
          buffer += charScanner.readChar();
        }
        
        token = Token.WORD(buffer);
      // NUMBER_INT
      } else if (charScanner.isDigit()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar() && charScanner.isDigit()) {
          buffer += charScanner.readChar();
        }

        token = new Token.Number.Integer(buffer);
      } else if (charScanner.isWhitespace()) {
        charScanner.readChar();
        while (charScanner.nextChar() && charScanner.isWhitespace()) {
          charScanner.readChar();
        }
        token = null;
      // SYMBOL
      } else {
        buffer += charScanner.readChar();
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
//        charScanner.pushback(buffer.length - selectedBuffer.length);
        token = selectedToken;
      }

      if (token) {
        tokens.push(token);
      }
    }
    return tokens;
  };

  exports.Scanner = Scanner;
})((module || {exports:{}}).exports);
