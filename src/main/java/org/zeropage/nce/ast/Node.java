package org.zeropage.nce.ast;

import java.io.IOException;
import java.io.Writer;

/**
 * Created by Kesarr on 2014-05-17.
 */
public interface Node {
    void print(Writer writer, int depth);

    public static void print(Writer writer, int depth, String string) {
        try {
            for (int i = 0; i < depth; i++) {
                writer.write("\t");
            }
            writer.write(string);
            writer.write("\n");
            writer.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
