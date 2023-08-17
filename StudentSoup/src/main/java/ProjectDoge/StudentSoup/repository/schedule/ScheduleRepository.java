package ProjectDoge.StudentSoup.repository.schedule;

import ProjectDoge.StudentSoup.entity.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> ,ScheduleRepositoryCustom{
}
