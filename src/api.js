(function(exports) {
  "use strict";

  var AST, Token, API;

  AST = require('./ast').AST;
  Token = require('./token').Token;

  API = {};

  // stdio.h
  // int putInt(int i)
  API.putInt = new AST.FunctionDecl(
    Token.Type.INT,
    new Token.Identifier('putInt'),
    new AST.ArgList(
      new AST.Arg(
        Token.Type.INT,
        new Token.Identifier('i')
      )
    )
  );
  // int putFloat(float f)
  API.putFloat = new AST.FunctionDecl(
    Token.Type.INT,
    new Token.Identifier('putFloat'),
    new AST.ArgList(
      new AST.Arg(
        Token.Type.FLOAT,
        new Token.Identifier('f')
      )
    )
  );

  // stdio.c
  API.putIntBody = {
    'execute': function(context) {
      var value = context.getValue(API.putInt.args.arg);
      console.log(value);
      context.setReturn(String(value).length);
    }
  };
  API.putFloatBody = {
    'execute': function(context) {
      var value = context.getValue(API.putFloat.args.arg);
      console.log(value);
      context.setReturn(String(value).length);
    }
  };

  exports.API = API;

})((module || {exports: {}}).exports);
