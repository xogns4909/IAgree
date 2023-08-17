package ProjectDoge.StudentSoup.repository.schedule;


import ProjectDoge.StudentSoup.entity.schedule.Schedule;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import static ProjectDoge.StudentSoup.entity.schedule.QSchedule.schedule;

@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Schedule> findByMemberIdAndDayOfWeek(Long memberId,String dayOfWeek){
        return queryFactory.select(schedule)
                .from(schedule)
                .where(schedule.member.memberId.eq(memberId)
                        ,schedule.dayOfWeek.eq(dayOfWeek))
                .fetch();

    }

    @Override
    public List<Schedule> findByMemberId(Long memberId){
        return queryFactory.select(schedule)
                .from(schedule)
                .where(schedule.member.memberId.eq(memberId))
                .fetch();
    }

    @Override
    public Optional<Schedule> findBySubject(String subject){
        Schedule query = queryFactory.select(schedule)
                .from(schedule)
                .where(schedule.subject.eq(subject))
                .fetchOne();

        return Optional.ofNullable(query);
    }
}
