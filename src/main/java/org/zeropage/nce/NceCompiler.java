package org.zeropage.nce;

import org.zeropage.nce.ast.Token;
import org.zeropage.nce.scanner.CharScanner;
import org.zeropage.nce.scanner.TokenScanner;

import java.io.InputStreamReader;

/**
 * Created by Kesarr on 2014-05-18.
 */
public class NceCompiler {
    public static void main(String args[]) {
        CharScanner scanner = new CharScanner(new InputStreamReader(System.in));
        TokenScanner tokenizer = new TokenScanner(scanner);

        Token token;
        while ((token = tokenizer.scanToken()) != null) {
            System.out.println(token);
        }
    }
}
