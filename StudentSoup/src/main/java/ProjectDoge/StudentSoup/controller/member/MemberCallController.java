package ProjectDoge.StudentSoup.controller.member;

import ProjectDoge.StudentSoup.dto.member.MemberDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberCallController {

    private final MemberRepository memberRepository;

    @PostMapping("member/info")
    public MemberDto findMember(@AuthenticationPrincipal String userId){
        Member member = memberRepository.findById(userId).orElse(null);
        return new MemberDto().getMemberDto(member);
    }
}
