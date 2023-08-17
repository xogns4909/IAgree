package ProjectDoge.StudentSoup.controller.admin;

import ProjectDoge.StudentSoup.dto.admin.AdminMemberUpdateForm;
import ProjectDoge.StudentSoup.dto.department.DepartmentSignUpDto;
import ProjectDoge.StudentSoup.dto.member.MemberDto;
import ProjectDoge.StudentSoup.dto.member.MemberFormBDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.entity.school.Department;
import ProjectDoge.StudentSoup.repository.member.MemberRepository;
import ProjectDoge.StudentSoup.service.admin.AdminMemberService;
import ProjectDoge.StudentSoup.service.department.DepartmentFindService;
import ProjectDoge.StudentSoup.service.member.MemberDeleteService;
import ProjectDoge.StudentSoup.service.member.MemberFindService;
import ProjectDoge.StudentSoup.service.member.MemberRegisterService;
import ProjectDoge.StudentSoup.service.school.SchoolFindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequestMapping("/admin")
@RequiredArgsConstructor
@RestController
public class AdminMemberController {
    private final MemberRepository memberRepository;
    private final MemberFindService memberFindService;
    private final MemberRegisterService memberRegisterService;
    private final AdminMemberService adminMemberService;
    private final MemberDeleteService memberDeleteService;
    private final SchoolFindService schoolFindService;
    private final DepartmentFindService departmentFindService;

    @GetMapping()
    public String adminPage(){
        return "admin/admin-index";
    }

//    @GetMapping("/member/new")
//    public String createMemberForm(){
//
//
//        model.addAttribute("memberForm", new AdminMemberForm());
//        model.addAttribute("genderTypes", GenderType.values());
//        List<School> schools = schoolFindService.findAll();
//        model.addAttribute("schools", schools);
//
//        return "/admin/member/createMember";
//    }

    @PostMapping("/member/new")
    public ResponseEntity<Long> createMemberForm(@RequestBody() MemberFormBDto memberForm){
        Long id = memberRegisterService.join(memberForm,memberForm.getToken(),memberForm.getIsNotificationEnabled());
        return ResponseEntity.ok(id);
    }

    @GetMapping("/member/edit/{memberId}")
    public  AdminMemberUpdateForm updateMemberForm(@PathVariable Long memberId){
        log.info("updateMemberForm 호출");
        Member member = memberRepository.updateFindById(memberId)
                .orElse(null);
        log.info("업데이트 용 회원 정보가 호출되었습니다. [{}]", member.getMemberId());
        AdminMemberUpdateForm memberForm = new AdminMemberUpdateForm().createMemberUpdateForm(member);
        return memberForm;
    }

    @PostMapping("/member/edit/{memberId}")
    public ResponseEntity<Long> updateMember(@PathVariable Long memberId, @RequestBody() AdminMemberUpdateForm updateForm){
        log.info("회원 업데이트가 시작되었습니다.");
        log.info("updateForm 전달 객체 : {}", updateForm.toString());
        log.info("MultipartFile : [{}]", updateForm.getMultipartFile());
        Long updateId = adminMemberService.adminMemberUpdate(updateForm, updateForm.getMultipartFile());

        Member member = memberFindService.findOne(updateId);
        log.info("updated member password : [{}]", member.getPwd());

        return ResponseEntity.ok(updateId);
    }

    @PostMapping("/member/ajax")
    @ResponseBody
    public List<DepartmentSignUpDto> getDepartment(@RequestBody Map<String, Long> param){
        Long schoolId = param.get("schoolId");
        log.info("member/ajax , schoolId : [{}]", schoolId);
        List<Department> Department = departmentFindService.getAllDepartmentUsingSchool(schoolId);
        List<DepartmentSignUpDto> dto = Department.stream()
                .map(department -> new DepartmentSignUpDto(department))
                .collect(Collectors.toList());
        return dto;
    }
    @GetMapping("members")
    public ResponseEntity<Map<String,List<MemberDto>>> getMembers(@RequestParam(required = false) String field,@RequestParam(required = false) String value){
        Map<String,List<MemberDto>> result = new HashMap<>();
        List<Member> members = memberRepository.findAll();
        List<Member> findMember = adminMemberService.searchMember(field,value);

        List<MemberDto> memberDto = getMemberDto(members);
        List<MemberDto> findMemberDto = getMemberDto(findMember);

        result.put("members",memberDto);
        result.put("findMembers",findMemberDto);
        return ResponseEntity.ok(result);
    }

    private List<MemberDto> getMemberDto(List<Member> members) {
        List<MemberDto> dto = new ArrayList<>();
        for(Member member : members){
            dto.add(new MemberDto().getMemberDto(member));
        }
        return dto;
    }

    @GetMapping("/member/delete/{memberId}")
    public ResponseEntity<Long> deleteMember(@PathVariable Long memberId){
        memberDeleteService.deleteMember(memberId);
        return ResponseEntity.ok(memberId);
    }

}
