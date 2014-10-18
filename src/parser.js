(function(exports) {
  "use strict";

  var Parser, LLParser, AST, Token;

  AST = require('./ast').AST;
  Token = require('./token').Token;

  Parser = function(tokens) {
    var ast, parser;

    parser = new LLParser(tokens);
    ast = parser.takeFunction();

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
      console.log('Unexpected token: ', this.tokens[0], tokenType);

      //TODO: override error type
      throw new Error('Unexpected token: ', this.tokens[0], tokenType);
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
    if (this.nextTokenIs(Token.COMMA)) {
      this.takeIt();
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
    id = this.takeIt(Token.Identifier);
    if (this.nextTokenIs(Token.COMMA)) {
      this.takeIt();
      idList = this.takeIdenList();
    }
    return new AST.IdenList(id, idList);
  };

  LLParser.prototype.takeStmt = function() {
    var expr;
    if (this.nextTokenIs(Token.Keyword.FOR)) {
      return this.takeForStmt();
    } else if (this.nextTokenIs(Token.Keyword.WHILE)) {
      return this.takeWhileStmt();
    } else if (this.nextTokenIs(Token.Keyword.IF)) {
      return this.takeIfStmt();
    } else if (this.nextTokenIs(Token.LBRACE)) {
      return this.takeCompoundStmt();
    } else if (this.nextTokenIs(Token.Type)) {
      return this.takeDeclaration();
    } else if (this.nextTokenIs(Token.SEMICOLON)) {
      this.takeIt();
      return new AST.Stmt();
    } else {
      expr = this.takeExpr();
      this.takeIt(Token.SEMICOLON);
      return new AST.Stmt.ExprStmt(expr);
    }
  };

  LLParser.prototype.takeForStmt = function() {
    var initExpr, condExpr, incrExpr, stmt;
    this.takeIt(Token.Keyword.FOR);
    this.takeIt(Token.LPAREN);
    initExpr = this.takeExpr();
    this.takeIt(Token.SEMICOLON);
    if (!this.nextTokenIs(Token.SEMICOLON)) {
      condExpr = this.takeExpr();
    }
    this.takeIt(Token.SEMICOLON);
    if (!this.nextTokenIs(Token.RPAREN)) {
      incrExpr = this.takeExpr();
    }
    this.takeIt(Token.RPAREN);
    stmt = this.takeStmt();
    return new AST.Stmt.ForStmt(initExpr, condExpr, incrExpr, stmt);
  };

  LLParser.prototype.takeWhileStmt = function() {
    var condExpr, stmt;
    this.takeIt(Token.Keyword.WHILE);
    this.takeIt(Token.LPAREN);
    condExpr = this.takeExpr();
    this.takeIt(Token.RPAREN);
    stmt = this.takeStmt();
    return new AST.Stmt.WhileStmt(condExpr, stmt);
  };

  LLParser.prototype.takeIfStmt = function() {
    var condExpr, ifStmt, elseStmt;
    this.takeIt(Token.Keyword.IF);
    this.takeIt(Token.LPAREN);
    condExpr = this.takeExpr();
    this.takeIt(Token.RPAREN);
    ifStmt = this.takeStmt();
    if (this.nextTokenIs(Token.Keyword.ELSE)) {
      this.takeIt();
      elseStmt = this.takeStmt();
    }
    return new AST.Stmt.IfStmt(condExpr, ifStmt, elseStmt);
  };

  LLParser.prototype.takeCompoundStmt = function() {
    var stmts;
    this.takeIt(Token.LBRACE);
    stmts = this.takeStmtList();
    this.takeIt(Token.RBRACE);
    return new AST.Stmt.CompoundStmt(stmts);
  };

  LLParser.prototype.takeStmtList = function() {
    var stmt, stmts;
    stmt = this.takeStmt();
    // FOLLOW(AST.StmtList) = {Token.RBRACE}
    if (!this.nextTokenIs(Token.RBRACE)) {
      stmts = this.takeStmtList();
    }
    return new AST.StmtList(stmt, stmts);
  };

  LLParser.prototype.takeExpr = function() {
    var id, expr, rvalue;
    if (this.nextTokenIs(Token.Identifier) &&
      this.nextTokenIs(Token.ASSIGN, 1)) {
      id = this.takeIt();
      this.takeIt();
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
    if (this.nextTokenIs(Token.Operator.Compare)) {
      operator = this.takeIt();
      rvalue = this.takeRvalue();
    }
    return new AST.Rvalue(mag, operator, rvalue);
  };

  LLParser.prototype.takeMag = function() {
    var term, operator, mag;
    term = this.takeTerm();
    if (this.nextTokenIs(Token.Operator.AddSub)) {
      operator = this.takeIt();
      mag = this.takeMag();
    }
    return new AST.Mag(term, operator, mag);
  };

  LLParser.prototype.takeTerm = function() {
    var factor, operator, term;
    factor = this.takeFactor();
    if (this.nextTokenIs(Token.Operator.MulDiv)) {
      operator = this.takeIt(Token.Operator.MulDiv);
      term = this.takeTerm();
    }
    return new AST.Term(factor, operator, term);
  }; 

  LLParser.prototype.takeFactor = function() {
    var expr, operator, factor, id, number;
    if (this.nextTokenIs(Token.LPAREN)) {
      this.takeIt();
      expr = this.takeExpr();
      this.takeIt(Token.RPAREN);
      return new AST.Factor(expr);
    } else if (this.nextTokenIs(Token.Operator.AddSub)) {
      operator = this.takeIt();
      factor = this.takeFactor();
      return new AST.Factor.UnaryFactor(operator, factor);
    } else if (this.nextTokenIs(Token.Identifier)) {
      id = this.takeIt();
      return new AST.Factor(id);
    } else if (this.nextTokenIs(Token.Number)) {
      number = this.takeIt();
      return new AST.Factor(number);
    } else throw new Error('Unexpected token: ', this.takeIt());
  };

  exports.Parser = Parser;
})((module || {exports: {}}).exports);
