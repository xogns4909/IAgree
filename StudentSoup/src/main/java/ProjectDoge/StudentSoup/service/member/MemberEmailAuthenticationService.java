package ProjectDoge.StudentSoup.service.member;

import ProjectDoge.StudentSoup.dto.member.EmailDto;
import ProjectDoge.StudentSoup.dto.member.MemberEmailAuthenticationDto;
import ProjectDoge.StudentSoup.entity.school.School;
import ProjectDoge.StudentSoup.exception.EmailAuthentication.AuthenticationEmailNotSentException;
import ProjectDoge.StudentSoup.exception.EmailAuthentication.AuthenticationNumberNotSentException;
import ProjectDoge.StudentSoup.exception.EmailAuthentication.AuthenticationNumberWrongException;
import ProjectDoge.StudentSoup.service.redis.RedisUtil;
import ProjectDoge.StudentSoup.service.school.SchoolFindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberEmailAuthenticationService {

    @Value("${admin.email}")
    private String adminEmail;

    private final SchoolFindService schoolFindService;

    private final MailSender mailSender;

    private final RedisUtil redisUtil;

    public ConcurrentHashMap<String,Object> findSchoolEmail(Long schoolId) {
        ConcurrentHashMap<String, Object> resultMap = new ConcurrentHashMap<>();
        School school = schoolFindService.findOne(schoolId);
        resultMap.put("domain",school.getSchoolEmail());
        return resultMap;
    }
    @Transactional
    public void join(String email){
        log.info("메일전송 메소드가 실행되었습니다.");
        int index = email.indexOf("@");
        if(email.substring(0,index).trim().length() == 0){
            throw new AuthenticationEmailNotSentException("메일이 전송되지 않았습니다.");
        }
        int authenticationNumber = createAuthenticationNumber();
        mailSend(email,authenticationNumber);
        redisUtil.setData(email,Integer.toString(authenticationNumber));
        return;
    }



    public ConcurrentHashMap<String,String> checkAuthenticationNumber(MemberEmailAuthenticationDto memberEmailAuthenticationDto){
        if(memberEmailAuthenticationDto.getAuthenticationNumber() == null){
            throw new AuthenticationNumberNotSentException("인증번호가 전송되지 않았습니다.");
        }
        ConcurrentHashMap<String,String> resultMap = new ConcurrentHashMap();
        String authenticationNumber = redisUtil.getData(memberEmailAuthenticationDto.getEmail());
        checkAuthenticationNumber(authenticationNumber, memberEmailAuthenticationDto.getAuthenticationNumber());
        resultMap.put("email", memberEmailAuthenticationDto.getEmail());
        resultMap.put("result","ok");
        redisUtil.deleteData(memberEmailAuthenticationDto.getEmail());

        return resultMap;
    }
    private void checkAuthenticationNumber(String authNumber, int number) {
        if(authNumber == null || !authNumber.equals(Integer.toString(number))){
            throw new AuthenticationNumberWrongException("잘못된 인증 번호입니다.");
        }
    }

    private int createAuthenticationNumber() {
        SecureRandom random = new SecureRandom();
        return random.nextInt(90000) + 10000;
    }
    private EmailDto createEmail(String email,int authenticationNumber) {
        EmailDto emailDto = new EmailDto();
        emailDto.setEmail(email);
        emailDto.setTitle("[studentSoup] 학교 인증 메일입니다.");
        emailDto.setMessage("안녕하세요. studentSoup 입니다.  인증번호는 " +authenticationNumber+ "입니다.");
        return emailDto;
    }

    public void mailSend(String email,int authenticationNumber){

        String title = "[studentSoup] 학교 인증 메일입니다.";
        String content = "안녕하세요. studentSoup 입니다.  인증번호는 " +authenticationNumber+ "입니다.";

        log.info("회원 학교 인증 메일을 생성 시작하였습니다.");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom(adminEmail);
        message.setSubject(title);
        message.setText(content);
        mailSender.send(message);
        redisUtil.setDataExpire(email,Integer.toString(authenticationNumber),60*5L);
        log.info("회원 학교 인증 메일이 전송되었습니다.");
    }
}
