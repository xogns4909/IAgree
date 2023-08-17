package ProjectDoge.StudentSoup.exhandler.advice;


import ProjectDoge.StudentSoup.exception.Schedule.ScheduleDuplicateException;
import ProjectDoge.StudentSoup.exhandler.ErrorResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ScheduleAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ScheduleDuplicateException.class)
    public ErrorResult ScheduleDuplicateException(ScheduleDuplicateException e){
        log.error("[exceptionHandle] ex", e);
        return new ErrorResult("ScheduleDuplicateException",e.getMessage());
    }
}
