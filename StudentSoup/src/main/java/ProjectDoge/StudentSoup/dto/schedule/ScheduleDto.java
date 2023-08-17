package ProjectDoge.StudentSoup.dto.schedule;

import ProjectDoge.StudentSoup.entity.schedule.Schedule;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ScheduleDto {

    private Long scheduleId;

    private String dayOfWeek;

    private int startTime;

    private int endTime;

    private String color;

    private String subject;

    public ScheduleDto createScheduleDto(Schedule schedule) {
        this.scheduleId = schedule.getScheduleId();
        this.dayOfWeek = schedule.getDayOfWeek();
        this.startTime = schedule.getStartTime();
        this.endTime = schedule.getEndTime();
        this.color = schedule.getColor();
        this.subject = schedule.getSubject();
        return this;
    }
}
