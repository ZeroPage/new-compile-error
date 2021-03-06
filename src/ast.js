(function(exports) {
  "use strict";

  var Token, NewSyntaxError, NewRuntimeError, AST = function AST() {
    this.arguments = arguments;

    if (arguments[0] instanceof Token || arguments[0] instanceof AST) {
      this.position = arguments[0].position;
    }
  };
  
  Token = require('./token').Token;

  NewSyntaxError = require('./error').NewSyntaxError;
  NewRuntimeError = require('./error').NewRuntimeError;

  AST.prototype.consistOf = function() {
    return this.arguments;
  };

  AST.prototype.accept = function(visitor) {
    var i, nodes = this.consistOf();
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i]) nodes[i].accept(visitor);
    }
  };

  AST.prototype.execute = function(context) {
    var i, nodes = this.consistOf();
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i] instanceof AST) nodes[i].execute(context);
    }
  };

  AST.Program = function Program(decls) {
    AST.apply(this, arguments);

    this.decls = decls;
  };

  AST.Program.prototype = new AST();

  AST.Program.prototype.execute = function(context) {
    var mainFunction;
    this.decls.execute(context);
    mainFunction = context.getFunction('main');
    mainFunction.id.decl = mainFunction;
    new AST.Expr.Factor.FunctionCall(
      mainFunction.id,
      new AST.ExprList(new Token.Number.Integer('0'))
    ).execute(context);
  };

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

  AST.FunctionDecl.prototype.execute = function(context) {
    context.addFunction(this.id.value, this);
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
      throw new NewSyntaxError('function parameter type not matched', expr, this.type);
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
    this.id.accept(visitor);
    if (this.expr) this.expr.accept(visitor);
    if (this.idList) this.idList.accept(visitor);
  };

  AST.IdentList.prototype.execute = function(context) {
    context.setValue(this, this.type.cast(this.expr ? this.expr.evaluate(context) : 0));
    if (this.idList) this.idList.execute(context);
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

  AST.Stmt.ForStmt.prototype.execute = function(context) {
    if (this.initExpr) this.initExpr.evaluate(context);
    while (this.condExpr.evaluate(context)) {
      this.stmt.execute(context);
      this.incrExpr.evaluate(context);
    }
  };

  AST.Stmt.WhileStmt = function WhileStmt(condExpr, stmt) {
    AST.Stmt.apply(this, arguments);

    this.condExpr = condExpr;
    this.stmt = stmt;
  };

  AST.Stmt.WhileStmt.prototype = new AST.Stmt();

  AST.Stmt.WhileStmt.prototype.execute = function(context) {
    while (this.condExpr.evaluate(context)) {
      this.stmt.execute(context);
    }
  };

  AST.Stmt.IfStmt = function IfStmt(condExpr, ifStmt, elseStmt) {
    AST.Stmt.apply(this, arguments);

    this.condExpr = condExpr;
    this.ifStmt = ifStmt;
    this.elseStmt = elseStmt;
  };

  AST.Stmt.IfStmt.prototype = new AST.Stmt();

  AST.Stmt.IfStmt.prototype.execute = function(context) {
    if (this.condExpr.evaluate(context)) {
      this.ifStmt.execute(context);
    } else if (this.elseStmt) {
      this.elseStmt.execute(context);
    }
  };

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

  AST.Stmt.ReturnStmt.prototype.execute = function(context) {
    context.setReturn(this.expr.evaluate(context));
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

  AST.Expr.prototype.evaluate = function(context) {
    return null;
  };

  AST.Expr.prototype.inferType = function() {
    return null;
  };

  AST.Expr.prototype.accept = function(visitor) {
    AST.prototype.accept.call(this, visitor);
    this.type = this.inferType();
  };

  AST.Expr.prototype.execute = function(context) {
    this.evaluate(context);
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

  AST.Expr.AssignExpr.prototype.evaluate = function(context) {
    var value = this.id.type.cast(this.expr.evaluate(context));
    context.setValue(this.id.decl, value);
    return value;
  };

  AST.Expr.RvalueExpr = function RvalueExpr(rvalue) {
    AST.Expr.apply(this, arguments);

    this.rvalue = rvalue;
  };

  AST.Expr.RvalueExpr.prototype = new AST.Expr();

  AST.Expr.RvalueExpr.prototype.inferType = function() {
    return this.rvalue.type;
  };

  AST.Expr.RvalueExpr.prototype.evaluate = function(context) {
    return this.rvalue.evaluate(context);
  };

  AST.Expr.BinaryExpr = function BinaryExpr(operand1, operator, operand2) {
    AST.Expr.apply(this, arguments);

    this.operand1 = operand1;
    this.operator = operator;
    this.operand2 = operand2;
  };

  AST.Expr.BinaryExpr.prototype = new AST.Expr();

  AST.Expr.BinaryExpr.prototype.evaluate = function(context) {
    if (this.operator) {
      return this.operator.operate(this.operand1.evaluate(context), this.operand2.evaluate(context));
    } else {
      return this.operand1.evaluate(context);
    }
  };

  AST.Expr.BinaryExpr.Rvalue = function Rvalue(mag, operator, rvalue) {
    AST.Expr.BinaryExpr.apply(this, arguments);

    this.mag = mag;
    this.operator = operator;
    this.rvalue = rvalue;
  };

  AST.Expr.BinaryExpr.Rvalue.prototype = new AST.Expr.BinaryExpr();

  AST.Expr.BinaryExpr.Rvalue.prototype.inferType = function() {
    if (this.operator) {
      return Token.Type.INT;
    }

    return this.mag.type;
  };

  AST.Expr.BinaryExpr.Mag = function Mag(term, operator, mag) {
    AST.Expr.BinaryExpr.apply(this, arguments);

    this.term = term;
    this.operator = operator;
    this.mag = mag;
  };

  AST.Expr.BinaryExpr.Mag.prototype = new AST.Expr.BinaryExpr();

  AST.Expr.BinaryExpr.Mag.prototype.inferType = function() {
    if (this.operator) {
      if (this.term.type.isAssignableFrom(this.mag.type)) {
        return this.term.type;
      } else if (this.mag.type.isAssignableFrom(this.term.type)) {
        return this.mag.type;
      } else {
        throw new NewSyntaxError('Invalid operands', [this.term.type, this.mag.type], this.operator);
      }
    } else {
      return this.term.type;
    }
  };

  AST.Expr.BinaryExpr.Term = function Term(factor, operator, term) {
    AST.Expr.BinaryExpr.apply(this, arguments);

    this.factor = factor;
    this.operator = operator;
    this.term = term;
  };

  AST.Expr.BinaryExpr.Term.prototype = new AST.Expr.BinaryExpr();

  AST.Expr.BinaryExpr.Term.prototype.inferType = function() {
    if (this.opeartor) {
      if (this.factor.type.isAssignableFrom(this.term.type)) {
        return this.factor.type;
      } else if (this.term.type.isAssignableFrom(this.factor.type)) {
        return this.term.type;
      } else {
        throw new NewSyntaxError('Invalid operands', [this.factor.type, this.term.type], this.operator);
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

  AST.Expr.Factor.prototype.evaluate = function(context) {
    return this.expr.evaluate(context);
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

  AST.Expr.Factor.UnaryFactor.prototype.evaluate = function(context) {
    return this.operator.operate(0, this.factor.evaluate(context));
  };

  AST.Expr.Factor.FunctionCall = function FunctionCall(id, params) {
    AST.Expr.Factor.apply(this, arguments);

    this.id = id;
    this.params = params;
  };

  AST.Expr.Factor.FunctionCall.prototype = new AST.Expr.Factor();

  AST.Expr.Factor.FunctionCall.prototype.inferType = function() {
    return this.id.type.token;
  };

  AST.Expr.Factor.FunctionCall.prototype.accept = function() {
    AST.Expr.Factor.prototype.accept.apply(this, arguments);

    return (!this.id.decl.args && !this.params) || this.id.decl.args.assertAssignableFrom(this.params);
  };

  AST.Expr.Factor.FunctionCall.prototype.evaluate = function(context) {
    var returnValue, params, args;
    context.pushFrame(this.id.decl, this, function(context) {
      for (params = this.params, args = this.id.decl.args; params && args; params = params.exprs, args = args.args) {
        //context.setValue(args.arg, params.expr.evaluate(context));
        context.stack.push(args.arg.type.cast(params.expr.evaluate(context)));
      }
    });
    this.id.decl.stmts.execute(context);
    //TODO: IF VOID, DON'T POP
    if (!this.id.is(Token.Type.FunctionType[Token.Type.VOID])) {
      returnValue = context.getReturn();
      if (returnValue === undefined) {
        returnValue = 0;
        //throw new NewRuntimeError('Function "' + this.id.value + '" should return.');
      }
    }
    context.setReturn();
    context.popFrame();
    return returnValue;
  };

  AST.ExprList = function ExprList(expr, exprs) {
    AST.apply(this, arguments);

    this.expr = expr;
    this.exprs = exprs;
  };

  AST.ExprList.prototype = new AST();

  exports.AST = AST;

})((module || {exports: {}}).exports);
