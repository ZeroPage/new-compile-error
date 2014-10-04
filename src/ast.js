(function(exports) {
  "use strict";

  var AST = function AST() {
    this.arguments = arguments;
  };

  AST.prototype.consistOf = function() {

  };

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

  AST.Factor.UnaryFactor = function UnaryFactor(operator, factor) {
    AST.apply(this, arguments);

    this.operator = operator;
    this.factor = factor;
  };

  exports = AST;

})((module || {exports: {}}).exports);