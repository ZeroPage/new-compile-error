package org.zeropage.nce.scanner;

import org.zeropage.nce.ast.Token;
import org.zeropage.nce.error.SyntaxError;

/**
* Created by Kesarr on 2014-05-11.
*/
public class TokenScanner {
    private final CharScanner scanner;

    public TokenScanner(CharScanner scanner) {
        this.scanner = scanner;
    }

    public Token scanToken() {
        Token current = null;
        Character c;
        while ((c = scanner.nextChar()) != null) {
            StringBuilder builder = new StringBuilder();
            switch (c) {
                case ' ':case '\t':case '\n':case '\r':
                    break;
                case '(':
                    current = new Token.LParenToken();
                    break;
                case ')':
                    current = new Token.RParenToken();
                    break;
                case '+':case '-':case '*':case '/':
                    builder.append(c);
                    current = new Token.OperatorToken(builder.toString());
                    break;
                case '.':
                    builder.append(c);
                    while (scanner.hasNextChar()) {
                        c = scanner.nextChar();
                        if (c >= '0' && c <= '9') {
                            builder.append(c);
                        } else {
                            if (builder.length() == 1) {
                                throw new SyntaxError();
                            }
                            scanner.pushback();
                            break;
                        }
                    }
                    current = new Token.DoubleToken(builder.toString());
                    break;
                case '0':
                    builder.append(c);
                    if (scanner.hasNextChar()) {
                        c = scanner.nextChar();
                        if (c == '.') {
                            builder.append(c);
                            while (scanner.hasNextChar()) {
                                c = scanner.nextChar();
                                if (c >= '0' && c <= '9') {
                                    builder.append(c);
                                } else {
                                    scanner.pushback();
                                    break;
                                }
                            }
                            current = new Token.DoubleToken(builder.toString());
                        } else {
                            scanner.pushback();
                            current = new Token.DecimalIntToken(builder.toString());
                        }
                    } else {
                        current = new Token.DecimalIntToken(builder.toString());
                    }
                    break;
                default:
                    if (c >= '1' && c <= '9') {
                        builder.append(c);
                        while (scanner.hasNextChar()) {
                            c = scanner.nextChar();
                            if (c >= '0' && c <= '9') {
                                builder.append(c);
                            } else {
                                break;
                            }
                        }
                        if (c == '.') {
                            builder.append(c);
                            while (scanner.hasNextChar()) {
                                c = scanner.nextChar();
                                if (c >= '0' && c <= '9') {
                                    builder.append(c);
                                } else {
                                    scanner.pushback();
                                    break;
                                }
                            }
                            current = new Token.DoubleToken(builder.toString());
                        } else {
                            if (!(c >= '0' && c <= '9')) {
                                scanner.pushback();
                            }
                            current = new Token.DecimalIntToken(builder.toString());
                        }
                    }
            }
            if (current != null) {
                break;
            }
        }
        return current;
    }

}
