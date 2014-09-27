(function(exports) {
  "use strict";

  var Parser, LLParser, AST;

  AST = require('./ast');

  Parser = function(tokens) {
    var ast;

    return ast;
  };

  LLParser = function LLParser(tokens) {
    this.tokens = tokens;
  };

  LLParser.prototype.takeIt = function(tokenType) {
    if (!tokenType || this.tokens[0] === tokenType || this.tokens[0] instanceof tokenType) {
      return this.tokens.shift();
    } else {
      return null;
      //throw new Error(this.tokens[0] + ' is not ' + tokenType);
    }
  };

  LLParser.prototype.takeFunction = function() {
    var type, id, args, stmts;
    type = this.takeIt(Token.Type);
    id = this.takeIt(Token.Identifier);
    this.takeIt(Token.LPAREN);
    args = this.takeArgList();
    this.takeIt(Token.RPAREN);
    stmts = this.takeCompoundStmt();
    return new AST.Function(type, id, args, stmts);
  };

  LLParser.prototype.takeArgList = function() {
    var arg, args;
    arg = this.takeArg();
    if (this.takeIt(Token.COMMA)) {
      args = this.takeArgList();
    }
    return new AST.ArgList(arg, args);
  };

  exports.Parser = Parser;
})((module || {exports: {}}).exports);
