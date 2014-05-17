package org.zeropage.nce.ast;

import java.io.Writer;

/**
 * Created by Kesarr on 2014-05-17.
 */
public class Expr implements Node {
    private final Term term;
    private final Token.OperatorToken operator;
    private final Expr expr;

    public Expr(Term term, Token.OperatorToken operator, Expr expr) {
        this.term = term;
        this.operator = operator;
        this.expr = expr;
    }

    public Expr(Term term) {
        this.term = term;
        this.operator = null;
        this.expr = null;
    }

    public static boolean canStartWith(Token token) {
        return Term.canStartWith(token);
    }

    @Override
    public void print(Writer writer, int depth) {
        Node.print(writer, depth, "Expr:");
        term.print(writer, depth + 1);
        if (operator != null) Node.print(writer, depth + 1, operator.toString());
        if (expr != null) expr.print(writer, depth + 1);
    }
}
