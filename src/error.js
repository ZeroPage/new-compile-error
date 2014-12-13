(function(exports) {
  "use strict";

  var NewSyntaxError = function NewSyntaxError(message, actual, expected) {
    Error.apply(this, arguments);

    this.message = message;
    this.actual = actual;
    this.expected = expected;
  };

  NewSyntaxError.prototype = new Error();

  NewSyntaxError.prototype.toString = function() {
    if (this.actual.position) {
      return this.message + ' ' + this.actual.position.toString();
    }
  };

  exports.NewSyntaxError = NewSyntaxError;
})((module || {exports: {}}).exports);