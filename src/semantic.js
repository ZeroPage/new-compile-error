(function(exports) {
  "use strict";

  var Context, ScopeStack, StdEnvironment, Visitor;

  StdEnvironment = new (function Scope() {
    this.parent = this;
  })();

  ScopeStack = function ScopeStack() {
    this.current = StdEnvironment;
  };

  ScopeStack.prototype.pushScope = function() {
    function Scope(parent) { this.parent = parent; }
    Scope.prototype = this.current;
    this.current = new Scope(this.current);
  };

  ScopeStack.prototype.popScope = function() {
    this.current = this.current.parent;
  };

  ScopeStack.prototype.putSymbol = function(symbol, type, node) {
    if (this.current.hasOwnProperty(symbol)) {
      throw new SyntaxError("Duplicate declaration in current scope", symbol);
    }
    this.current[symbol] = {
      type: type,
      node: node
    };
  };

  ScopeStack.prototype.getSymbol = function(symbol) {
    return this.current[symbol];
  };

  Visitor = function Visitor(context) {
    this.context = context;
  };

  Visitor.prototype.visitFunctionDecl = function(node, callback) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
    this.context.pushScope();
    callback.call(node, this);
    this.context.popScope();
  };

  Visitor.prototype.visitArg = function(node) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
  };

  Visitor.prototype.visitIdentList = function(node) {
    this.context.scopeStack.putSymbol(node.id, node.type, node);
  };

  Context = function Context(scopeStack) {
    this.scopeStack = scopeStack; 
  };

  exports.Analyzer = function SemanticAnalyzer(ast) {
    // scope
    // symbol table
    // type checking

    // traverse AST
    ast.accept(new Visitor(new Context(new ScopeStack())));
  };
})((module || {exports: {}}).exports);
