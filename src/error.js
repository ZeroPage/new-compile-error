(function(exports) {
  "use strict";

  var SyntaxError = function SyntaxError(message, actual, expected) {
    Error.apply(this, arguments);

    this.message = message;
    this.actual = actual;
    this.expected = expected;
  };

  SyntaxError.prototype = new Error();

  exports.SyntaxError = SyntaxError;
})((module || {exports: {}}).exports);