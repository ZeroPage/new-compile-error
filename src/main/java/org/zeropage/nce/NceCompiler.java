package org.zeropage.nce;

import org.zeropage.nce.ast.Expr;
import org.zeropage.nce.parser.LL1Parser;
import org.zeropage.nce.parser.NceParser;
import org.zeropage.nce.scanner.CharScanner;
import org.zeropage.nce.scanner.TokenScanner;

import java.io.InputStreamReader;
import java.io.PrintWriter;

/**
 * Created by Kesarr on 2014-05-18.
 */
public class NceCompiler {
    public static void main(String args[]) {
        CharScanner scanner = new CharScanner(new InputStreamReader(System.in));
        TokenScanner tokenizer = new TokenScanner(scanner);

        NceParser parser = new LL1Parser(tokenizer);
        Expr expr = parser.takeExpr();
        expr.print(new PrintWriter(System.out), 0);
    }
}
