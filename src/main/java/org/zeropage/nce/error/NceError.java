package org.zeropage.nce.error;

/**
 * Created by Kesarr on 2014-05-18.
 */
public class NceError extends RuntimeException {
    public NceError() {
        super();
    }
    public NceError(String message) {
        super(message);
    }
    public NceError(String message, Throwable cause) {
        super(message, cause);
    }
    public NceError(Throwable cause) {
        super(cause);
    }
}
