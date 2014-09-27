# NewCompileError

http://wiki.zeropage.org/wiki.php/NewCompileError


## MiniC

### BNF description for LL(>=1) grammars
```
Function ::= Type identifier "(" ArgList ")" CompoundStmt
ArgList ::= Arg ( "," ArgList ) ?
Arg ::= Type identifier
Declaration ::= Type IdentList ";"
Type ::= "int"
       | "float"
IdentList ::= identifier ( "," IdentList ) ?
Stmt ::= ForStmt
       | WhileStmt
       | Expr ";"
       | IfStmt
       | CompoundStmt
       | Declaration
       | ";"
ForStmt ::= for "(" Expr ";" OptExpr ";" OptExpr ")" Stmt
OptExpr ::= Expr ?
WhileStmt ::= while "(" Expr ")" Stmt
IfStmt ::= if "(" Expr ")" Stmt ElsePart
ElsePart ::= ( else Stmt ) ?
CompoundStmt ::= "{" StmtList "}"
StmtList ::= Stmt StmtList ?
Expr ::= identifier "=" Expr
       | Rvalue
Rvalue ::= Mag (Compare Mag)*
Compare ::= "=="
          | "<"
          | ">"
          | "<="
          | ">="
          | "!="
Mag ::= Term (Addsub Term)*
Addsub ::= "+"
         | "-"
Term ::= Factor (Multidiv Factor)*
Multidiv ::= "*"
           | "/"
Factor ::= "(" Expr ")"
         | "-" Factor
         | "+" Factor
         | identifier
         | number
```
