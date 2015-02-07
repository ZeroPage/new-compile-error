(function(exports) {
  "use strict";

  var API = require('./api').API;

  exports.Linker = function Runtime(ast) {
    API.putInt.stmts = API.putIntBody;
    API.putFloat.stmts = API.putFloatBody;
  };
})((module || {exports: {}}).exports);
