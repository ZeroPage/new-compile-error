(function(exports) {
  "use strict";

  var Token, NewSyntaxError, AST = function AST() {
    this.arguments = arguments;
  };
  
  Token = require('./token').Token;

  NewSyntaxError = require('./error').NewSyntaxError;

  AST.prototype.consistOf = function() {
    return this.arguments;
  };

  AST.prototype.accept = function(visitor) {
    var i, nodes = this.consistOf();
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i]) nodes[i].accept(visitor);
    }
  };

  AST.Program = function Program(decls) {
    AST.apply(this, arguments);

    this.decls = decls;
  };

  AST.Program.prototype = new AST();

  AST.DeclList = function DeclList(decl, decls) {
    AST.apply(this, arguments);

    this.decl = decl;
    this.decls = decls;
  };

  AST.DeclList.prototype = new AST();

  AST.VarDeclList = function VarDeclList(decl, decls) {
    AST.apply(this, arguments);

    this.decl = decl;
    this.decls = decls;
  };

  AST.VarDeclList.prototype = new AST();

  AST.FunctionDecl = function FunctionDecl(type, id, args, stmts) {
    AST.apply(this, arguments);

    this.type = type;
    this.id = id;
    this.args = args;
    this.stmts = stmts;
  };

  AST.FunctionDecl.prototype = new AST();

  AST.FunctionDecl.prototype.accept = function(visitor) {
    visitor.visitFunctionDecl(this);
    if (this.args) this.args.accept(visitor);
    if (this.stmts) this.stmts.accept(visitor);
  };

  AST.ArgList = function ArgList(arg, args) {
    AST.apply(this, arguments);

    this.arg = arg;
    this.args = args;
  };

  AST.ArgList.prototype = new AST();

  AST.ArgList.prototype.assertAssignableFrom = function(exprs) {
    this.arg.assertAssignableFrom(exprs.expr);

    if ( this.args && exprs.exprs ) {
      this.args.assertAssignableFrom(exprs.exprs);
    } else if ( this.args || exprs.exprs ) {
      throw new NewSyntaxError('function parameter size not matched', exprs.exprs, this.args);
    }
  };

  AST.Arg = function Arg(type, id) {
    AST.apply(this, arguments);

    this.type = type;
    this.id = id;
  };

  AST.Arg.prototype = new AST();

  AST.Arg.prototype.assertAssignableFrom = function(expr) {
    if (!this.type.isAssignableFrom(expr.type)) {
      throw new NewSyntaxError('function parameter type not matched', expr.type, this.type);
    }
    return true;
  };

  AST.Arg.prototype.accept = function(visitor) {
    visitor.visitArg(this);
  };

  AST.VarDecl = function VarDecl(type, idList) {
    AST.apply(this, arguments);

    this.type = type;
    this.idList = idList;
    this.idList.setType(type);
  };

  AST.VarDecl.prototype = new AST();

  AST.IdentList = function IdentList(id, expr, idList) {
    AST.apply(this, arguments);

    this.id = id;
    this.expr = expr;
    this.idList = idList;
  };

  AST.IdentList.prototype = new AST();

  AST.IdentList.prototype.setType = function(type) {
    this.type = type;
    if (this.idList) this.idList.setType(type);
  };

  AST.IdentList.prototype.accept = function(visitor) {
    visitor.visitIdentList(this);
    if (this.idList) this.idList.accept(visitor);
  };

  AST.Stmt = function Stmt() {
    AST.apply(this, arguments);
  };

  AST.Stmt.prototype = new AST();

  AST.Stmt.ForStmt = function ForStmt(initExpr, condExpr, incrExpr, stmt) {
    AST.Stmt.apply(this, arguments);

    this.initExpr = initExpr;
    this.condExpr = condExpr;
    this.incrExpr = incrExpr;
    this.stmt = stmt;
  };

  AST.Stmt.ForStmt.prototype = new AST.Stmt();

  AST.Stmt.WhileStmt = function WhileStmt(condExpr, stmt) {
    AST.Stmt.apply(this, arguments);

    this.condExpr = condExpr;
    this.stmt = stmt;
  };

  AST.Stmt.WhileStmt.prototype = new AST.Stmt();

  AST.Stmt.IfStmt = function IfStmt(condExpr, ifStmt, elseStmt) {
    AST.Stmt.apply(this, arguments);

    this.condExpr = condExpr;
    this.ifStmt = ifStmt;
    this.elseStmt = elseStmt;
  };

  AST.Stmt.IfStmt.prototype = new AST.Stmt();

  AST.Stmt.CompoundStmt = function CompoundStmt(decls, stmts) {
    AST.Stmt.apply(this, arguments);

    this.decls = decls;
    this.stmts = stmts;
  };

  AST.Stmt.CompoundStmt.prototype = new AST.Stmt();

  AST.Stmt.CompoundStmt.prototype.accept = function(visitor) {
    visitor.visitCompoundStmt(this, function(visitor) {
      if (this.decls) this.decls.accept(visitor);
      if (this.stmts) this.stmts.accept(visitor);
    });
  };

  AST.Stmt.ReturnStmt = function ReturnStmt(expr) {
    AST.Stmt.apply(this, arguments);

    this.expr = expr;
  };

  AST.Stmt.ReturnStmt.prototype = new AST.Stmt();

  AST.Stmt.ReturnStmt.prototype.accept = function(visitor) {
    if (this.expr) this.expr.accept(visitor);
    visitor.visitReturnStmt(this);
  };

  AST.Stmt.ExprStmt = function ExprStmt(expr) {
    AST.Stmt.apply(this, arguments);

    this.expr = expr;
  };

  AST.Stmt.ExprStmt.prototype = new AST.Stmt();

  AST.StmtList = function StmtList(stmt, stmts) {
    AST.apply(this, arguments);

    this.stmt = stmt;
    this.stmts = stmts;
  };

  AST.StmtList.prototype = new AST();

  AST.Expr = function Expr() {
    AST.apply(this, arguments);
  };

  AST.Expr.prototype = new AST();

  AST.Expr.prototype.evaluate = function() {
    return null;
  };

  AST.Expr.prototype.getType = function() {
    return null;
  };

  AST.Expr.prototype.accept = function(visitor) {
    AST.prototype.accept.call(this, visitor);
    this.type = this.inferType();
  };

  AST.Expr.AssignExpr = function AssignExpr(id, expr) {
    AST.Expr.apply(this, arguments);

    this.id = id;
    this.expr = expr;
  };

  AST.Expr.AssignExpr.prototype = new AST.Expr();

  AST.Expr.AssignExpr.prototype.inferType = function() {
    if (!this.id.type.isAssignableFrom(this.expr.type))
      throw new NewSyntaxError('Cannot assign value', this.expr.type, this.id.type);

    return this.id.type;
  };

  AST.Expr.RvalueExpr = function RvalueExpr(rvalue) {
    AST.Expr.apply(this, arguments);

    this.rvalue = rvalue;
  };

  AST.Expr.RvalueExpr.prototype = new AST.Expr();

  AST.Expr.RvalueExpr.prototype.inferType = function() {
    return this.rvalue.type;
  };

  AST.Expr.Rvalue = function Rvalue(mag, operator, rvalue) {
    AST.Expr.apply(this, arguments);

    this.mag = mag;
    this.operator = operator;
    this.rvalue = rvalue;
  };

  AST.Expr.Rvalue.prototype = new AST.Expr();

  AST.Expr.Rvalue.prototype.inferType = function() {
    if ( this.operator ) {
      return Token.Type.INT;
    }

    return this.mag.type;
  };

  AST.Expr.Mag = function Mag(term, operator, mag) {
    AST.Expr.apply(this, arguments);

    this.term = term;
    this.operator = operator;
    this.mag = mag;
  };

  AST.Expr.Mag.prototype = new AST.Expr();

  AST.Expr.Mag.prototype.inferType = function() {
    if (this.operator) {
      if (this.term.type.isAssignableFrom(this.mag.type)) {
        return this.term.type;
      } else if (this.mag.type.isAssignableFrom(this.term.type)) {
        return this.mag.type;
      } else {
        throw new NewSyntaxError('Cannot assign value', this.expr.type, this.id.type);
      }
    } else {
      return this.term.type;
    }
  };

  AST.Expr.Term = function Term(factor, operator, term) {
    AST.Expr.apply(this, arguments);

    this.factor = factor;
    this.operator = operator;
    this.term = term;
  };

  AST.Expr.Term.prototype = new AST.Expr();

  AST.Expr.Term.prototype.inferType = function() {
    if (this.opeartor) {
      if (this.factor.type.isAssignableFrom(this.term.type)) {
        return this.factor.type;
      } else if (this.term.type.isAssignableFrom(this.factor.type)) {
        return this.term.type;
      }
    } else {
      return this.factor.type;
    }
  };

  AST.Expr.Factor = function Factor(expr) {
    AST.Expr.apply(this, arguments);

    this.expr = expr;
  };

  AST.Expr.Factor.prototype = new AST.Expr();

  AST.Expr.Factor.prototype.inferType = function() {
    return this.expr.type;
  };

  AST.Expr.Factor.UnaryFactor = function UnaryFactor(operator, factor) {
    AST.Expr.Factor.apply(this, arguments);

    this.operator = operator;
    this.factor = factor;
  };

  AST.Expr.Factor.UnaryFactor.prototype = new AST.Expr.Factor();

  AST.Expr.Factor.UnaryFactor.prototype.inferType = function() {
    return this.factor.type;
  };

  AST.Expr.Factor.FunctionCall = function FunctionCall(id, params) {
    AST.Expr.Factor.apply(this, arguments);

    this.id = id;
    this.params = params;
  };

  AST.Expr.Factor.FunctionCall.prototype = new AST.Expr.Factor();

  AST.Expr.Factor.FunctionCall.prototype.inferType = function() {
    return this.id.type;
  };

  AST.Expr.Factor.FunctionCall.prototype.accept = function() {
    AST.Expr.Factor.prototype.accept.apply(this, arguments);

    return this.id.decl.args.assertAssignableFrom(this.params);
  };

  AST.ExprList = function ExprList(expr, exprs) {
    AST.apply(this, arguments);

    this.expr = expr;
    this.exprs = exprs;
  };

  AST.ExprList.prototype = new AST();

  exports.AST = AST;

})((module || {exports: {}}).exports);
