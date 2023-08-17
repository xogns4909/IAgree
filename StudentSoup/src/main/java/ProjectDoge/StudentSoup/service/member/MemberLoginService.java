package ProjectDoge.StudentSoup.service.member;

import ProjectDoge.StudentSoup.dto.member.MemberDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.exception.member.MemberNotMatchIdPwdException;
import ProjectDoge.StudentSoup.repository.member.MemberRepository;
import ProjectDoge.StudentSoup.service.redis.RedisUtil;
import ProjectDoge.StudentSoup.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberLoginService{

    private final MemberRepository memberRepository;

    private final RedisUtil redisUtil;
    private final BCryptPasswordEncoder encoder;

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.refreshSecret}")
    private String refreshSecretKey;
    @Value("${jwt.token-validity-in-seconds}")
    private Long expiredMs;

    @Value("${jwt.refreshToken-validity-in-seconds}")
    private Long refreshExpireMs;


    public Map<String,String> login(String id, String pwd) {
        log.info("로그인 서비스 로직 실행");
        Member member = validationIdPwd(id, pwd);
        MemberDto memberDto = new MemberDto();
        Map<String, String> tokenMap = JwtUtil.creatJwt(id,member.getMemberClassification().toString(), secretKey, expiredMs, refreshSecretKey, refreshExpireMs);
        log.info("로그인이 완료되었습니다. 현재 로그인 된 회원의 아이디[{}], 닉네임[{}]", member.getId(), member.getNickname());

        return tokenMap;
    }

    private Member validationIdPwd(String id, String pwd){
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> {
                    log.info("아이디와 패스워드가 일치하는 회원을 찾지 못하였습니다. [{}], [{}]", id, pwd);
                    throw new MemberNotMatchIdPwdException("아이디 또는 패스워드가 일치하지 않습니다.");
                });

        if(!encoder.matches(pwd, member.getPwd())) {
            log.info("아이디와 패스워드가 일치하는 회원을 찾지 못하였습니다. [{}], [{}]", id, pwd);
            throw new MemberNotMatchIdPwdException("아이디 또는 패스워드가 일치하지 않습니다.");
        }

        return member;
    }

}
