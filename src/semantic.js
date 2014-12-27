(function(exports) {
  "use strict";

  var Context, ScopeStack, StdEnvironment, Visitor, NewSyntaxError, isAssignableFrom, AST, Token;

  NewSyntaxError = require('./error').NewSyntaxError;
  AST = require('./ast').AST;
  Token = require('./token').Token;

  /* jshint ignore:start */
  StdEnvironment = new (function Scope() {
    this.$parent = this;
  })();
  /* jshint ignore:end */

  ScopeStack = function ScopeStack() {
    this.current = StdEnvironment;
  };

  ScopeStack.prototype.pushScope = function(node) {
    function Scope($parent) { this.$parent = $parent; }
    Scope.prototype = this.current;
    this.current = new Scope(this.current);
    this.current.$decl = node;
  };

  ScopeStack.prototype.popScope = function() {
    this.current = this.current.$parent;
  };

  ScopeStack.prototype.putSymbol = function(symbol, type, node) {
    if (this.current.hasOwnProperty(symbol.value || symbol)) {
      throw new NewSyntaxError("Duplicate declaration in current scope", symbol);
    }
    this.current[symbol.value || symbol] = {
      type: type,
      node: node
    };
  };

  ScopeStack.prototype.getSymbol = function(symbol) {
    var _symbol = this.current[symbol.value || symbol];
    if (!_symbol) {
      throw new NewSyntaxError("Undefined symbol", symbol);
    }
    return _symbol;
  };

  Visitor = function Visitor(context) {
    this.context = context;
  };

  Visitor.prototype.visitFunctionDecl = function(node) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
    this.isFunctionDecl = true;
    this.context.scopeStack.pushScope(node);
  };

  Visitor.prototype.visitArg = function(node) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
  };

  Visitor.prototype.visitIdentList = function(node) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
  };

  Visitor.prototype.visitCompoundStmt = function(node, callback) {
    if (!this.isFunctionDecl) {
      this.context.scopeStack.pushScope();
    }
    this.isFunctionDecl = false;

    if (callback) callback.call(node, this);

    this.context.scopeStack.popScope();
  };

  Visitor.prototype.visitIdentifier = function(node) {
    var symbol = this.context.scopeStack.getSymbol(node);
    if (symbol.node instanceof AST.FunctionDecl) {
      node.type = Token.Type.FunctionType[symbol.type];
    } else {
      node.type = symbol.type;
    }
    node.decl = symbol.node;
  };

  Visitor.prototype.visitReturnStmt = function(node) {
    if (!this.context.scopeStack.current.$decl.type.isAssignableFrom(node.expr.type)) {
      throw new NewSyntaxError('function return type is not matched', node.expr.type, this.context.scopeStack.current.$decl.type);
    }
  };

  Context = function Context(scopeStack) {
    this.scopeStack = scopeStack;
    this.stack = [];
  };

  exports.Analyzer = function SemanticAnalyzer(ast) {
    // scope
    // symbol table
    // type checking

    // traverse AST
    try {
      ast.accept(new Visitor(new Context(new ScopeStack())));
    } catch (e) {
      if (e instanceof NewSyntaxError) {
        console.error(e.message, e.actual, e.expected);
        console.error(e.toString());
      } else {
        console.error(e);
      }
    }
  };
})((module || {exports: {}}).exports);
