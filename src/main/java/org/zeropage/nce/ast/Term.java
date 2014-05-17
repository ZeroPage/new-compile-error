package org.zeropage.nce.ast;

import java.io.Writer;

/**
 * Created by Kesarr on 2014-05-17.
 */
public class Term implements Node {
    private final Factor factor;
    private final Token.OperatorToken operator;
    private final Term term;

    public Term(Factor factor, Token.OperatorToken operator, Term term) {
        this.factor = factor;
        this.operator = operator;
        this.term = term;
    }

    public Term(Factor factor) {
        this.factor = factor;
        this.operator = null;
        this.term = null;
    }

    public static boolean canStartWith(Token token) {
        return Factor.canStartWith(token);
    }

    @Override
    public void print(Writer writer, int depth) {
        Node.print(writer, depth, "Term:");
        factor.print(writer, depth + 1);
        if (operator != null) Node.print(writer, depth + 1, operator.toString());
        if (term != null) term.print(writer, depth + 1);
    }
}
