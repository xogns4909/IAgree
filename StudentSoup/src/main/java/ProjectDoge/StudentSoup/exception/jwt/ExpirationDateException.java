package ProjectDoge.StudentSoup.exception.jwt;

public class ExpirationDateException extends RuntimeException{

    public ExpirationDateException() {
        super();
    }

    public ExpirationDateException(String message) {
        super(message);
    }

    public ExpirationDateException(String message, Throwable cause) {
        super(message, cause);
    }

    public ExpirationDateException(Throwable cause) {
        super(cause);
    }

    protected ExpirationDateException(String message, Throwable cause,
                                      boolean enableSuppression,
                                      boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
