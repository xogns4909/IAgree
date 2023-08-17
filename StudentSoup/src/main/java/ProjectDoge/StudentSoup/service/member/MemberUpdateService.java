package ProjectDoge.StudentSoup.service.member;

import ProjectDoge.StudentSoup.dto.member.MemberUpdateDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.entity.member.MemberClassification;
import ProjectDoge.StudentSoup.entity.school.Department;
import ProjectDoge.StudentSoup.entity.school.School;
import ProjectDoge.StudentSoup.repository.member.MemberRepository;
import ProjectDoge.StudentSoup.service.department.DepartmentFindService;
import ProjectDoge.StudentSoup.service.school.SchoolFindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberUpdateService {

    private final MemberFindService memberFindService;
    private final MemberValidationService memberValidationService;
    private final SchoolFindService schoolFindService;
    private final DepartmentFindService departmentFindService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    @Transactional
    public Long updateMember(MemberUpdateDto dto){
        log.info("운영 페이지 회원 업데이트 메소드가 실행되었습니다.");
        Member member = memberFindService.findOne(dto.getMemberId());
        validationChangedMember(dto, member);
        log.info("운영 페이지 회원 업데이트가 완료되었습니다.");
        return member.getMemberId();
    }
    private void validationChangedMember(MemberUpdateDto dto, Member member) {
        log.info("회원 업데이트 중 닉네임과 이메일 검증을 시작합니다.");
        if(!member.getNickname().equals(dto.getNickname())) {
            memberValidationService.validateDuplicateMemberNickname(dto.getNickname());
            member.setNickname(dto.getNickname());
        }
        else if(!member.getEmail().equals(dto.getEmail())) {
            memberValidationService.validateDuplicateMemberEmail(dto.getEmail());
            log.info("회원 업데이트 중 닉네임 이메일 검증이 완료되었습니다.");
            member.setEmail(dto.getEmail());
            checkSchoolChange(member,dto);
        }
        else if(dto.getPwd()!=null && !member.getPwd().equals(passwordEncoder.encode(dto.getPwd()))){
            member.setPwd(passwordEncoder.encode(dto.getPwd()));
        }
        else if(!member.getDepartment().getId().equals(dto.getDepartmentId())){
            Department department = departmentFindService.findOne(dto.getDepartmentId());
            member.setDepartment(department);
        }
        updateMemberField(dto, member);
    }

    private void checkSchoolChange(Member member, MemberUpdateDto dto) {
        if(!member.getSchool().getId().equals(dto.getSchoolId())){
            changeSchool(member, dto);
        }
    }

    private void changeSchool(Member member, MemberUpdateDto dto) {
        School school = schoolFindService.findOne(dto.getSchoolId());
        Department department = departmentFindService.findOne(dto.getDepartmentId());
        member.setSchool(school);
        member.setDepartment(department);
    }

    private void updateMemberField(MemberUpdateDto dto, Member member) {
        log.info("회원 정보 업데이트를 시작하였습니다.");
        School school = schoolFindService.findOne(dto.getSchoolId());
        Department department = departmentFindService.findOne(dto.getDepartmentId());
        log.info("이전 학교와 학과 : [{}][{}], 받은 학교와 학과 : [{}][{}]",
                member.getSchool().getSchoolName(),
                member.getDepartment().getDepartmentName(),
                school.getSchoolName(),
                department.getDepartmentName());

        memberRepository.save(member);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateMemberClassification(Member member){
        member.setMemberClassification(MemberClassification.ADMIN);
        memberRepository.save(member);
    }
}
