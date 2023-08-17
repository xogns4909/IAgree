package ProjectDoge.StudentSoup.exception.Schedule;


public class ScheduleDuplicateException extends RuntimeException{

    public ScheduleDuplicateException() {
        super();
    }

    public ScheduleDuplicateException(String message) {
        super(message);
    }

    public ScheduleDuplicateException(String message, Throwable cause) {
        super(message, cause);
    }

    protected ScheduleDuplicateException(String message, Throwable cause,
                                         boolean enableSuppression,
                                         boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
