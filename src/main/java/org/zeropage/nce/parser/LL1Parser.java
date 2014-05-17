package org.zeropage.nce.parser;

import org.zeropage.nce.ast.*;
import org.zeropage.nce.error.SyntaxError;
import org.zeropage.nce.scanner.TokenScanner;

/**
 * Created by Kesarr on 2014-05-17.
 */
public class LL1Parser implements NceParser {
    private final TokenScanner scanner;
    private Token token;

    public LL1Parser(TokenScanner scanner) {
        this.scanner = scanner;
        takeIt();
    }

    @Override
    public Expr takeExpr() {
        Term term = takeTerm();
        if (token instanceof Token.OperatorToken) {
            Token.OperatorToken operator = (Token.OperatorToken) token;
            if (operator.isAddSubOperator()) {
                takeIt();
                Expr expr = takeExpr();

                return new Expr(term, operator, expr);
            }
        }
        return new Expr(term);
    }

    @Override
    public Term takeTerm() {
        Factor factor = takeFactor();
        if (token instanceof Token.OperatorToken) {
            Token.OperatorToken operator = (Token.OperatorToken) token;
            if (operator.isMulDivOperator()) {
                takeIt();
                Term term = takeTerm();

                return new Term(factor, operator, term);
            }
        }
        return new Term(factor);
    }

    @Override
    public Factor takeFactor() {
        if (token instanceof Token.LParenToken) {
            takeIt(Token.LParenToken.class);
            Expr expr = takeExpr();
            takeIt(Token.RParenToken.class);

            return new Factor.ExprFactor(expr);
        } else if (Value.canStartWith(token)) {
            Value value = takeValue();

            return new Factor.ValueFactor(value);
        }
        throw new SyntaxError();
    }

    @Override
    public Value takeValue() {
        if (Value.canStartWith(token)) {
            Value value = new Value(token);
            takeIt();
            return value;
        }
        throw new SyntaxError();
    }

    private void takeIt() {
        token = scanner.scanToken();
    }

    private void takeIt(Class<? extends Token> clazz) {
        if (!clazz.isAssignableFrom(token.getClass())) {
            throw new SyntaxError();
        }
        takeIt();
    }
}
