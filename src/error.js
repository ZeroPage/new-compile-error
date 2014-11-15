(function(exports) {
  "use strict";

  var NewSyntaxError = function NewSyntaxError(message, actual, expected) {
    Error.apply(this, arguments);

    this.message = message;
    this.actual = actual;
    this.expected = expected;
  };

  NewSyntaxError.prototype = new Error();

  exports.NewSyntaxError = NewSyntaxError;
})((module || {exports: {}}).exports);