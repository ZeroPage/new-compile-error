package org.zeropage.nce.ast;

import java.io.Writer;

/**
 * Created by Kesarr on 2014-05-17.
 */
public class Value implements Node {
    private final Token token;

    public Value(Token token) {
        this.token = token;
    }

    public static boolean canStartWith(Token token) {
        return token instanceof Token.DecimalIntToken
                || token instanceof Token.DoubleToken;
    }

    @Override
    public void print(Writer writer, int depth) {
        Node.print(writer, depth, "Value:");
        Node.print(writer, depth + 1, token.toString());
    }
}
