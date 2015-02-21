(function(exports) {
  "use strict";

  var API = require('./api').API;

  exports.Linker = function Runtime(ast) {
    API.putInt.stmts = API.putIntBody;
    API.putFloat.stmts = API.putFloatBody;
    API.puts.stmts = API.putsBody;
    API.getInt.stmts = API.getIntBody;
    API.getFloat.stmts = API.getFloatBody;
    API.gets.stmts = API.getsBody;
  };
})((module || {exports: {}}).exports);
