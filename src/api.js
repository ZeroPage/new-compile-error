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
    ),
    new AST.Stmt.CompoundStmt()
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
    ),
    new AST.Stmt.CompoundStmt()
  );
  // int puts(string s)
  API.puts = new AST.FunctionDecl(
    Token.Type.INT,
    new Token.Identifier('puts'),
    new AST.ArgList(
      new AST.Arg(
        Token.Type.STRING,
        new Token.Identifier('s')
      )
    ),
    new AST.Stmt.CompoundStmt()
  );

  API.getInt = new AST.FunctionDecl(
    Token.Type.INT,
    new Token.Identifier('getInt'),
    null,
    new AST.Stmt.CompoundStmt()
  );

  API.getFloat = new AST.FunctionDecl(
    Token.Type.FLOAT,
    new Token.Identifier('getFloat'),
    null,
    new AST.Stmt.CompoundStmt()
  );

  API.gets = new AST.FunctionDecl(
    Token.Type.STRING,
    new Token.Identifier('gets'),
    null,
    new AST.Stmt.CompoundStmt()
  );

  // stdio.c
  API.putIntBody = {
    'execute': function(context) {
      var value = context.getValue(API.putInt.args.arg);
      document.getElementById('stdout').value += value + '\n';
      context.setReturn(String(value).length);
    }
  };
  API.putFloatBody = {
    'execute': function(context) {
      var value = context.getValue(API.putFloat.args.arg);
      document.getElementById('stdout').value += value + '\n';
      context.setReturn(String(value).length);
    }
  };
  API.putsBody = {
    'execute': function(context) {
      var value = context.getValue(API.puts.args.arg);
      document.getElementById('stdout').value += value;
      context.setReturn(String(value).length);
    }
  };

  API.getIntBody = {
    'execute': function(context) {
      var token = new Token.Number.Integer(window.prompt());
      context.setReturn(token.evaluate(context));
    }
  };

  API.getFloatBody = {
    'execute': function(context) {
      var token = new Token.Number.Float(window.prompt());
      context.setReturn(token.evaluate(context));
    }
  };

  API.getsBody = {
    'execute': function(context) {
      var token = new Token.String(window.prompt());
      context.setReturn(token.evaluate(context));
    }
  };

  exports.API = API;

})((module || {exports: {}}).exports);
