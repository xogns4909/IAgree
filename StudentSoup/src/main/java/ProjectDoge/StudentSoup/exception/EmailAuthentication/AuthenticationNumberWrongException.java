package ProjectDoge.StudentSoup.exception.EmailAuthentication;

public class AuthenticationNumberWrongException extends RuntimeException{

    public AuthenticationNumberWrongException() {
        super();
    }

    public AuthenticationNumberWrongException(String message) {
        super(message);
    }

    public AuthenticationNumberWrongException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthenticationNumberWrongException(Throwable cause) {
        super(cause);
    }

    protected AuthenticationNumberWrongException(String message, Throwable cause,
                                                 boolean enableSuppression,
                                                 boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
