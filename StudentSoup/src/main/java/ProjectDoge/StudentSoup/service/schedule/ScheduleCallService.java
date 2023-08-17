package ProjectDoge.StudentSoup.service.schedule;

import ProjectDoge.StudentSoup.dto.schedule.ScheduleDto;
import ProjectDoge.StudentSoup.entity.schedule.Schedule;
import ProjectDoge.StudentSoup.exception.member.MemberIdNotSentException;
import ProjectDoge.StudentSoup.repository.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleCallService {

    private final ScheduleRepository scheduleRepository;

    public List<ScheduleDto> getSchedule(Long memberId){
        memberIdNullCheck(memberId);
        List<Schedule> schedules = scheduleRepository.findByMemberId(memberId);
        List<ScheduleDto> scheduleDtoList = createScheduleDto(schedules);
        return scheduleDtoList;
    }

    private void memberIdNullCheck(Long memberId) {
        if(memberId == null){
            throw new MemberIdNotSentException("회원 아이디가 전송되지 않았습니다.");
        }
    }

    private List<ScheduleDto> createScheduleDto(List<Schedule> schedules) {
        List<ScheduleDto> scheduleDtoList = new ArrayList<>();
        for (Schedule schedule : schedules) {
                ScheduleDto scheduleDto = new ScheduleDto().createScheduleDto(schedule);
                scheduleDtoList.add(scheduleDto);
        }
        return scheduleDtoList;
    }
}
