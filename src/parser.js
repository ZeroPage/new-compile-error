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
    if ( this.nextTokenIs(tokenType) ) {
      return this.tokens.shift();
    } else {
      return null;
      //throw new Error(this.tokens[0] + ' is not ' + tokenType);
    }
  };

  LLParser.prototype.nextTokenIs = function(tokenType) {
    return !tokenType || this.tokens[0] === tokenType || this.tokens[0] instanceof tokenType;
  }

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

  LLParser.prototype.takeArg = function() {
    var type, id;
    type = this.takeIt(Token.Type);
    id = this.takeIt(Token.Identifier);
    return new AST.Arg(type, id);
  }

  LLParser.prototype.takeDeclaration = function() {
    var type, idList;
    type = this.takeIt(Token.Type);
    idList = this.takeIdenList();
    this.takeIt(Token.SEMICOLON);
    return new AST.Declaration(type, idList);
  }

  LLParser.prototype.takeIdenList = function() {
    var id, idList;
    // TODO : implement
  }

  LLParser.prototype.takeExpr = function() {
    var id, expr, rvalue;
    id = this.takeIt(Token.Identifier);

    // TODO : implement lookahead method
    if ( this.lookahead(Token.ASSIGN) ) {
      expr = this.takeExpr();
      // TODO : make each concrete class for expr/rvalue
      return new AST.Expr(id, expr);
    } else {
      rvalue = this.takeRvalue(id);
      return new AST.Expr(rvalue);
    }
  }

  exports.Parser = Parser;
})((module || {exports: {}}).exports);
