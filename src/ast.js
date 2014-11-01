(function(exports) {
  "use strict";

  var AST = function AST() {
    this.arguments = arguments;
  };

  AST.prototype.consistOf = function() {

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

  AST.ArgList = function ArgList(arg, args) {
    AST.apply(this, arguments);

    this.arg = arg;
    this.args = args;
  };

  AST.ArgList.prototype = new AST();

  AST.Arg = function Arg(type, id) {
    AST.apply(this, arguments);

    this.type = type;
    this.id = id;
  };

  AST.Arg.prototype = new AST();

  AST.VarDecl = function VarDecl(type, idList) {
    AST.apply(this, arguments);

    this.type = type;
    this.idList = idList;
  };

  AST.VarDecl.prototype = new AST();

  AST.IdentList = function IdentList(id, expr, idList) {
    AST.apply(this, arguments);

    this.id = id;
    this.expr = expr;
    this.idList = idList;
  };

  AST.IdentList.prototype = new AST();

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

  AST.Stmt.ReturnStmt = function ReturnStmt(expr) {
    AST.Stmt.apply(this, arguments);

    this.expr = expr;
  };

  AST.Stmt.ReturnStmt.prototype = new AST.Stmt();

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

  AST.Expr.AssignExpr = function AssignExpr(id, expr) {
    AST.Expr.apply(this, arguments);

    this.id = id;
    this.expr = expr;
  };

  AST.Expr.AssignExpr.prototype = new AST.Expr();

  AST.Expr.RvalueExpr = function RvalueExpr(rvalue) {
    AST.Expr.apply(this, arguments);

    this.rvalue = rvalue;
  };

  AST.Expr.RvalueExpr.prototype = new AST.Expr();

  AST.Rvalue = function Rvalue(mag, operator, rvalue) {
    AST.apply(this, arguments);

    this.mag = mag;
    this.operator = operator;
    this.rvalue = rvalue;
  };

  AST.Rvalue.prototype = new AST();

  AST.Mag = function Mag(term, operator, mag) {
    AST.apply(this, arguments);

    this.term = term;
    this.operator = operator;
    this.mag = mag;
  };

  AST.Mag.prototype = new AST();

  AST.Term = function Term(factor, operator, term) {
    AST.apply(this, arguments);

    this.factor = factor;
    this.operator = operator;
    this.term = term;
  };

  AST.Term.prototype = new AST();

  AST.Factor = function Factor(expr) {
    AST.apply(this, arguments);

    this.expr = expr;
  };

  AST.Factor.prototype = new AST();

  AST.Factor.UnaryFactor = function UnaryFactor(operator, factor) {
    AST.Factor.apply(this, arguments);

    this.operator = operator;
    this.factor = factor;
  };

  AST.Factor.UnaryFactor.prototype = new AST.Factor();

  AST.Factor.FunctionCall = function FunctionCall(id, params) {
    AST.Factor.apply(this, arguments);

    this.id = id;
    this.params = params;
  };

  AST.Factor.FunctionCall.prototype = new AST.Factor();

  AST.ExprList = function ExprList(expr, exprs) {
    AST.apply(this, arguments);

    this.expr = expr;
    this.exprs = exprs;
  };

  AST.ExprList.prototype = new AST();

  exports.AST = AST;

})((module || {exports: {}}).exports);