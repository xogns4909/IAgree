package ProjectDoge.StudentSoup.entity.schedule;

import ProjectDoge.StudentSoup.dto.schedule.ScheduleDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
@Setter
@Getter

public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @NotEmpty
    private String dayOfWeek;
    @NotNull
    private int startTime;
    @NotNull
    private int endTime;
    @NotEmpty
    private String color;
    @NotEmpty
    private String subject;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    public Schedule createSchedule(ScheduleDto scheduleDto, Member member) {
        this.dayOfWeek = scheduleDto.getDayOfWeek();
        this.startTime = scheduleDto.getStartTime();
        this.endTime = scheduleDto.getEndTime();
        this.color = scheduleDto.getColor();
        this.subject = scheduleDto.getSubject();
        this.member = member;
        return  this;
    }
}
