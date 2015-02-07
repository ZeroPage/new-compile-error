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
    return this.message;
  };

  var NewRuntimeError = function NewRuntimeError(message) {
    Error.apply(this, arguments);

    this.message = message;
  };

  NewRuntimeError.prototype = new Error();

  NewRuntimeError.prototype.toString = function() {
    return this.message;
  };

  exports.NewSyntaxError = NewSyntaxError;
  exports.NewRuntimeError = NewRuntimeError;
})((module || {exports: {}}).exports);