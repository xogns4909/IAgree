package ProjectDoge.StudentSoup.controller.schedule;

import ProjectDoge.StudentSoup.dto.schedule.ScheduleDto;
import ProjectDoge.StudentSoup.repository.schedule.ScheduleRepository;
import ProjectDoge.StudentSoup.service.schedule.ScheduleCallService;
import ProjectDoge.StudentSoup.service.schedule.ScheduleRegisterService;
import ProjectDoge.StudentSoup.service.schedule.ScheduleUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleRegisterService scheduleRegisterService;

    private final ScheduleRepository scheduleRepository;

    private final ScheduleCallService scheduleCallService;

    private final ScheduleUpdateService scheduleUpdateService;

    @PostMapping("schedule/{memberId}")
    public List<ScheduleDto> callSchedule(@PathVariable Long memberId){
        List<ScheduleDto> schedules = scheduleCallService.getSchedule(memberId);
        return schedules;
    }
    @GetMapping("schedule/{scheduleId}")
    public ScheduleDto getUpdateSchedule(@PathVariable Long scheduleId){
        ScheduleDto updateBoard = scheduleUpdateService.getUpdateBoard(scheduleId);
        return updateBoard;
    }

    @PatchMapping("schedule/{memberId}")
    public Long SetUpdateSchedule(@PathVariable Long memberId,@RequestBody ScheduleDto scheduleDto){
        return scheduleUpdateService.setUpdateSchedule(scheduleDto,memberId);

    }


    @PutMapping("schedule/{memberId}")
    public Long createSchedule(@RequestBody ScheduleDto scheduleDto, @PathVariable Long memberId){
        log.info("{},{},{},{},{}",scheduleDto.getSubject(),scheduleDto.getDayOfWeek(),scheduleDto.getColor(),scheduleDto.getStartTime(),scheduleDto);
        return scheduleRegisterService.join(scheduleDto, memberId);
    }

    @DeleteMapping("schedule/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long scheduleId){
        scheduleRepository.deleteById(scheduleId);
    return ResponseEntity.ok("ok");
    }
}
