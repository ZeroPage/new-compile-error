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
    if (!tokenType || this.nextTokenIs(tokenType)) {
      return this.tokens.shift();
    } else {
      //return null;
      throw new Error(this.tokens[0] + ' is not ' + tokenType);
    }
  };

  LLParser.prototype.nextTokenIs = function(tokenType, lookahead) {
    return this.tokens[lookahead || 0].is(tokenType);
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

  LLParser.prototype.takeArg = function() {
    var type, id;
    type = this.takeIt(Token.Type);
    id = this.takeIt(Token.Identifier);
    return new AST.Arg(type, id);
  };

  LLParser.prototype.takeDeclaration = function() {
    var type, idList;
    type = this.takeIt(Token.Type);
    idList = this.takeIdenList();
    this.takeIt(Token.SEMICOLON);
    return new AST.Declaration(type, idList);
  };

  LLParser.prototype.takeIdenList = function() {
    var id, idList;
    // TODO : implement
  };

  LLParser.prototype.takeExpr = function() {
    var id, expr, rvalue;
    if (this.nextTokenIs(Token.Identifier)
      && this.nextTokenIs(Token.ASSIGN, 1)) {
      id = this.takeIt();
      takeIt();
      expr = this.takeExpr();
      return new AST.Expr.AssignExpr(id, expr);
    } else {
      rvalue = this.takeRvalue();
      return new AST.Expr.RvalueExpr(rvalue);
    }
  };

  LLParser.prototype.takeRvalue = function() {
    var mag, operator, rvalue;
    mag = this.takeMag();
    if (operator = this.takeIt(Token.Operator.Compare)) {
      rvalue = this.takeRvalue();
    }
    return new AST.Rvalue(mag, operator, rvalue);
  };

  LLParser.prototype.takeMag = function() {
    var term, operator, mag;
    term = this.takeTerm();
    if (operator = this.takeIt(Token.Operator.AddSub)) {
      mag = this.takeMag();
    }
    return new AST.Mag(term, operator, mag);
  };

  LLParser.prototype.takeTerm = function() {
    var factor, operator, term;
    factor = this.takeFactor();
    if (operator = this.takeIt(Token.Operator.MulDiv)) {
      term = this.takeTerm();
    }
    return new AST.Term(factor, operator, term);
  }; 

  LLParser.prototype.takeFactor = function() {
    var expr, operator, factor, id, number;
    if(this.nextTokenIs(Token.LPAREN)) {
      this.takeIt();
      expr = this.takeExpr();
      this.takeIt(Token.RPAREN);
      return expr;
    } else if(this.nextTokenIs(Token.Operator.AddSub)) {
      operator = this.takeIt();
      factor = this.takeFactor();
      return new AST.Factor.UnaryFactor(operator, factor);
    }
    //TODO : Other Factor
  };

  exports.Parser = Parser;
})((module || {exports: {}}).exports);
