package ProjectDoge.StudentSoup.repository.schedule;

import ProjectDoge.StudentSoup.entity.schedule.Schedule;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepositoryCustom {

    List<Schedule> findByMemberIdAndDayOfWeek(Long memberId,String dayOfWeek);

    Optional<Schedule> findBySubject(String subject);

    List<Schedule> findByMemberId(Long memberId);
}
