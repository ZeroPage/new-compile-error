package org.zeropage.nce.parser;

import org.zeropage.nce.ast.Expr;
import org.zeropage.nce.ast.Factor;
import org.zeropage.nce.ast.Term;
import org.zeropage.nce.ast.Value;

/**
 * Created by Kesarr on 2014-05-17.
 */
public interface NceParser {
    Expr takeExpr();
    Term takeTerm();
    Factor takeFactor();
    Value takeValue();
}
