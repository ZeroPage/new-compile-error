(function() {
  'use strict';

  var Scanner, CharScanner;

  CharScanner = function CharScanner() {

  };

  CharScanner.prototype.nextChar = function() {
    //TODO: if this.char is consumable
  };

  CharScanner.prototype.readChar = function() {
    //TODO: consume and return this.char
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
    var char, buffer, token, charScanner;

    charScanner = new CharScanner();

    while (charScanner.nextChar()) {
      buffer = '';

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
      } else if (charScanner.isDigit()) {
        buffer += charScanner.readChar();

        while (charScanner.nextChar()) {
          if (charScanner.isDigit()) {
            buffer += charScanner.readChar();
          }
        }

        token = Token.NUMBER_INT(buffer);
      } else {
        buffer += charScanner.readChar();
        //FIXME: buffer is not only one char
        token = Token.SYMBOL(buffer);
      }
    }
  };
})();
