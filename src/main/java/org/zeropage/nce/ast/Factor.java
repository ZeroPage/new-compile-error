package org.zeropage.nce.ast;

import java.io.Writer;

/**
 * Created by Kesarr on 2014-05-17.
 */
public abstract class Factor implements Node {
    public static boolean canStartWith(Token token) {
        return token instanceof Token.LParenToken
                || Value.canStartWith(token);
    }

    public static class ExprFactor extends Factor {
        private final Expr expr;

        public ExprFactor(Expr expr) {
            this.expr = expr;
        }

        @Override
        public void print(Writer writer, int depth) {
            expr.print(writer, depth);
        }
    }
    public static class ValueFactor extends Factor {
        private final Value value;

        public ValueFactor(Value value) {
            this.value = value;
        }

        @Override
        public void print(Writer writer, int depth) {
            value.print(writer, depth);
        }
    }
}
