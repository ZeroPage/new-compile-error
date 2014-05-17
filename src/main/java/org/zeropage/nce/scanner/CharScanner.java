package org.zeropage.nce.scanner;

import org.zeropage.nce.error.NceError;

import java.io.IOException;
import java.io.PushbackReader;
import java.io.Reader;

public class CharScanner {
    private final PushbackReader reader;
    private int current = -1;

    public CharScanner(Reader reader) {
        this.reader = new PushbackReader(reader);
    }

    public Character nextChar() {
        try {
            current = reader.read();

            if (current < 0) {
                return null;
            }
            return (char) current;
        } catch (IOException e) {
            throw new NceError(e);
        }
    }

    public boolean hasNextChar() {
        try {
            return reader.ready();
        } catch (IOException e) {
            return false;
        }
    }

    public void pushback() {
        if (current < 0) {
            throw new NceError();
        }
        try {
            reader.unread(current);
        } catch (IOException e) {
            throw new NceError(e);
        }
    }


}