package ProjectDoge.StudentSoup.service.schedule;


import ProjectDoge.StudentSoup.dto.schedule.ScheduleDto;
import ProjectDoge.StudentSoup.entity.schedule.Schedule;
import ProjectDoge.StudentSoup.exception.Schedule.ScheduleDuplicateException;
import ProjectDoge.StudentSoup.exception.member.MemberIdNotSentException;
import ProjectDoge.StudentSoup.repository.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ScheduleUpdateService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleDto getUpdateBoard(Long scheduleId){
        Schedule schedule = scheduleRepository.findById(scheduleId).orElse(null);
        ScheduleDto scheduleDto = new ScheduleDto().createScheduleDto(schedule);
        return scheduleDto;
    }
    @Transactional
    public Long setUpdateSchedule(ScheduleDto scheduleDto,Long memberId) {
        memberIdNullCheck(memberId);
        List<Schedule> schedules = scheduleRepository.findByMemberIdAndDayOfWeek(memberId, scheduleDto.getDayOfWeek());
        checkDuplicateTime(schedules,scheduleDto);
        Schedule schedule = scheduleRepository.findById(scheduleDto.getScheduleId()).orElse(null);
        updateSchedule(schedule,scheduleDto);
        scheduleRepository.save(schedule);

        return schedule.getScheduleId();
    }

    private void memberIdNullCheck(Long memberId) {
        if(memberId == null){
            throw new MemberIdNotSentException("회원 아이디가 전송되지 않았습니다.");
        }
    }

    private void checkDuplicateTime(List<Schedule> schedules, ScheduleDto scheduleDto) {
        for (Schedule schedule : schedules) {
            log.info("Dto={}, entity={}",scheduleDto.getScheduleId(),schedule.getScheduleId());
            if(!schedule.getScheduleId().equals(scheduleDto.getScheduleId()) && scheduleDto.getStartTime() >= schedule.getStartTime() && scheduleDto.getStartTime() <schedule.getEndTime()
                    || !schedule.getScheduleId().equals(scheduleDto.getScheduleId()) && scheduleDto.getEndTime() > schedule.getStartTime() && scheduleDto.getEndTime() <= schedule.getEndTime()){
                throw new ScheduleDuplicateException("중복된 시간이 있습니다.");
            }
        }
    }

    private void updateSchedule(Schedule schedule, ScheduleDto scheduleDto) {
        schedule.setColor(scheduleDto.getColor());
        schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
        schedule.setStartTime(scheduleDto.getStartTime());
        schedule.setEndTime(scheduleDto.getEndTime());
        schedule.setSubject(scheduleDto.getSubject());
    }
}
