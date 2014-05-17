package org.zeropage.nce.ast;

/**
 * Created by Kesarr on 2014-05-10.
 */
public class Token {
    public static class LParenToken extends Token {
        @Override
        public String toString() {
            return "LParen: (";
        }
    }

    public static class RParenToken extends Token {
        @Override
        public String toString() {
            return "RParen: )";
        }
    }

    public static class OperatorToken extends Token {
        private final String operator;

        public OperatorToken(String operator) {
            this.operator = operator;
        }

        @Override
        public String toString() {
            return "Operator: " + operator;
        }
    }

    public static class DecimalIntToken extends Token {
        private final String decimalInt;

        public DecimalIntToken(String decimalInt) {
            this.decimalInt = decimalInt;
        }

        @Override
        public String toString() {
            return "DecimalInt: " + decimalInt;
        }
    }

    public static class DoubleToken extends Token {
        private final String decimalDouble;

        public DoubleToken(String decimalDouble) {
            this.decimalDouble = decimalDouble;
        }

        @Override
        public String toString() {
            return "Double: " + decimalDouble;
        }
    }
}
