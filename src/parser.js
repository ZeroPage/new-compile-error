(function(exports) {
  "use strict";

  var Parser, LLParser, AST, Token, NewSyntaxError;

  AST = require('./ast').AST;
  Token = require('./token').Token;

  NewSyntaxError = require('./error').NewSyntaxError;

  Parser = function(tokens) {
    var ast, parser;

    parser = new LLParser(tokens);
    ast = parser.takeProgram();
    parser.takeIt(Token.EOF);

    return ast;
  };

  LLParser = function LLParser(tokens) {
    this.tokens = tokens;
  };

  LLParser.prototype.takeIt = function(tokenType) {
    if (!tokenType || this.nextTokenIs(tokenType)) {
      return this.tokens.shift();
    } else {
      //TODO: override error type
      throw new NewSyntaxError('Unexpected token: ', this.tokens[0], tokenType);
    }
  };

  LLParser.prototype.nextTokenIs = function(tokenType, lookahead) {
    lookahead = lookahead || 0;
    return this.tokens.length > lookahead && this.tokens[lookahead].is(tokenType);
  };

  LLParser.prototype.takeProgram = function() {
    var decls;
    if (this.nextTokenIs(Token.Type)) {
      decls = this.takeDeclList();
    }
    return new AST.Program(decls);
  };

  LLParser.prototype.takeDeclList = function() {
    var decl, decls;
    if (this.nextTokenIs(Token.LPAREN, 2)) {
      decl = this.takeFunctionDecl();
    } else {
      decl = this.takeVarDecl();
    }
    if (this.nextTokenIs(Token.Type)) {
      decls = this.takeDeclList();
    }
    return new AST.DeclList(decl, decls);
  };

  LLParser.prototype.takeFunctionDecl = function() {
    var type, id, args, stmts;
    type = this.takeIt(Token.Type);
    id = this.takeIt(Token.Identifier);
    this.takeIt(Token.LPAREN);
    if (!this.nextTokenIs(Token.RPAREN)) {
      args = this.takeArgList();
    }
    this.takeIt(Token.RPAREN);
    stmts = this.takeCompoundStmt();
    return new AST.FunctionDecl(type, id, args, stmts);
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

  LLParser.prototype.takeVarDecl = function() {
    var type, idList;
    type = this.takeIt(Token.Type);
    idList = this.takeIdentList();
    this.takeIt(Token.SEMICOLON);
    return new AST.VarDecl(type, idList);
  };

  LLParser.prototype.takeIdentList = function() {
    var id, expr, idList;
    id = this.takeIt(Token.Identifier);
    if (this.nextTokenIs(Token.ASSIGN)) {
      this.takeIt();
      expr = this.takeExpr();
    }
    if (this.nextTokenIs(Token.COMMA)) {
      this.takeIt();
      idList = this.takeIdentList();
    }
    return new AST.IdentList(id, expr, idList);
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
    } else if (this.nextTokenIs(Token.Keyword.RETURN)) {
      this.takeIt();
      if (!this.nextTokenIs(Token.SEMICOLON)) {
        expr = this.takeExpr();
      }
      this.takeIt(Token.SEMICOLON);
      return new AST.Stmt.ReturnStmt(expr);
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
    var decls, stmts;
    this.takeIt(Token.LBRACE);
    if (this.nextTokenIs(Token.Type)) {
      decls = this.takeVarDeclList();
    }
    if (!this.nextTokenIs(Token.RBRACE)) {
      stmts = this.takeStmtList();
    }
    this.takeIt(Token.RBRACE);
    return new AST.Stmt.CompoundStmt(decls, stmts);
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

  LLParser.prototype.takeVarDeclList = function() {
    var decl, decls;
    decl = this.takeVarDecl();
    if (this.nextTokenIs(Token.Type)) {
      decls = this.takeVarDeclList();
    }
    return new AST.VarDeclList(decl, decls);
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
    return new AST.Expr.BinaryExpr.Rvalue(mag, operator, rvalue);
  };

  LLParser.prototype.takeMag = function() {
    var term, operator, mag;
    term = this.takeTerm();
    if (this.nextTokenIs(Token.Operator.AddSub)) {
      operator = this.takeIt();
      mag = this.takeMag();
    }
    return new AST.Expr.BinaryExpr.Mag(term, operator, mag);
  };

  LLParser.prototype.takeTerm = function() {
    var factor, operator, term;
    factor = this.takeFactor();
    if (this.nextTokenIs(Token.Operator.MulDiv)) {
      operator = this.takeIt(Token.Operator.MulDiv);
      term = this.takeTerm();
    }
    return new AST.Expr.BinaryExpr.Term(factor, operator, term);
  }; 

  LLParser.prototype.takeFactor = function() {
    var expr, operator, factor, id, params, number, string;
    if (this.nextTokenIs(Token.LPAREN)) {
      this.takeIt();
      expr = this.takeExpr();
      this.takeIt(Token.RPAREN);
      return new AST.Expr.Factor(expr);
    } else if (this.nextTokenIs(Token.Operator.AddSub)) {
      operator = this.takeIt();
      factor = this.takeFactor();
      return new AST.Expr.Factor.UnaryFactor(operator, factor);
    } else if (this.nextTokenIs(Token.Identifier)) {
      id = this.takeIt();
      if (this.nextTokenIs(Token.LPAREN)) {
        this.takeIt();
        if (!this.nextTokenIs(Token.RPAREN)) {
          params = this.takeExprList();
        }
        this.takeIt(Token.RPAREN);
        return new AST.Expr.Factor.FunctionCall(id, params);
      }
      return new AST.Expr.Factor(id);
    } else if (this.nextTokenIs(Token.Number)) {
      number = this.takeIt();
      return new AST.Expr.Factor(number);
    } else if (this.nextTokenIs(Token.String)) {
      string = this.takeIt();
      return new AST.Expr.Factor(string);
    } else {
      throw new NewSyntaxError('Unexpected token: ', this.takeIt());
    }
  };

  LLParser.prototype.takeExprList = function() {
    var expr, exprs;
    expr = this.takeExpr();
    if (this.nextTokenIs(Token.COMMA)) {
      this.takeIt();
      exprs = this.takeExprList();
    }
    return new AST.ExprList(expr, exprs);
  };

  exports.Parser = Parser;
})((module || {exports: {}}).exports);
