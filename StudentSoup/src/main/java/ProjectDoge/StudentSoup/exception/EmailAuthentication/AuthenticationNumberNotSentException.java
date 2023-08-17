package ProjectDoge.StudentSoup.exception.EmailAuthentication;

public class AuthenticationNumberNotSentException extends RuntimeException{

    public AuthenticationNumberNotSentException() {
        super();
    }

    public AuthenticationNumberNotSentException(String message) {
        super(message);
    }

    public AuthenticationNumberNotSentException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthenticationNumberNotSentException(Throwable cause) {
        super(cause);
    }

    protected AuthenticationNumberNotSentException(String message, Throwable cause,
                                                   boolean enableSuppression,
                                                   boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
