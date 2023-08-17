package ProjectDoge.StudentSoup.exception.EmailAuthentication;

public class AuthenticationTimeOverException extends RuntimeException{

    public AuthenticationTimeOverException() {
        super();
    }

    public AuthenticationTimeOverException(String message) {
        super(message);
    }

    public AuthenticationTimeOverException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthenticationTimeOverException(Throwable cause) {
        super(cause);
    }

    protected AuthenticationTimeOverException(String message, Throwable cause,
                                              boolean enableSuppression,
                                              boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
