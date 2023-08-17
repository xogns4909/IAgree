package ProjectDoge.StudentSoup.exception.EmailAuthentication;

public class AuthenticationEmailNotSentException extends RuntimeException{
    public AuthenticationEmailNotSentException() {
        super();
    }

    public AuthenticationEmailNotSentException(String message) {
        super(message);
    }

    public AuthenticationEmailNotSentException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthenticationEmailNotSentException(Throwable cause) {
        super(cause);
    }

    protected AuthenticationEmailNotSentException(String message, Throwable cause,
                                                  boolean enableSuppression,
                                                  boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
