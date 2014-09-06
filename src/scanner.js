(function() {
  'use strict';

  var Scanner, CharScanner;

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

  CharScanner = function CharScanner(script) {
    if (!script || script.tagName.toUpperCase() !== 'SCRIPT' || !script.src && !/[^\s]/.test(script.innerText)) {
      throw new Error('script element is invalid');
    }

    this.buffer = script.innerText.split('');
    this.consumed = [];
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
    return isAlpha(this.char) || this.char === '_';
  };

  CharScanner.prototype.isIdentifierChar = function() {
    return isAlpha(this.char) || isDigit(this.char) || this.char === '_';
  };

  Scanner = function Scanner() {
    var char, buffer, token, charScanner, selectedToken, selectedBuffer;

    charScanner = new CharScanner();

    while (charScanner.nextChar()) {
      buffer = '';

      // IDENTIFIER || TYPE_INT || TYPE_FLOAT
      if (charScanner.isIdentifierStartChar()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar()) {
          if (charScanner.isIdentifierChar()) {
            buffer += charScanner.readChar();
          }
        }

        switch (buffer) {
          case 'int':
            token = Token.TYPE_INT;
            break;
          case 'float':
            token = Token.TYPE_FLOAT;
            break;
          default:
            token = Token.IDENTIFIER(buffer);
        }
      // NUMBER_INT
      } else if (charScanner.isDigit()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar()) {
          if (charScanner.isDigit()) {
            buffer += charScanner.readChar();
          }
        }

        token = Token.NUMBER_INT(buffer);
      // SYMBOL
      } else {
        buffer += charScanner.readChar();
        obj = Token.SYMBOL_OBJ(buffer);
        selectedToken = token = Token.SYMBOL(buffer);
        selectedBuffer = buffer;

        while (obj instanceof Object && Object.keys(obj).length > 1) {
          buffer += charScanner.readChar();
          obj = Token.SYMBOL_OBJ(buffer);
          token = Token.SYMBOL(buffer);
          if (token) {
            selectedToken = token;
            selectedBuffer = buffer;
          }
        }
        charScanner.pushback(this.buffer.length - this.selectedBuffer.length);
        return selectedToken;
      }
    }
  };
})();
