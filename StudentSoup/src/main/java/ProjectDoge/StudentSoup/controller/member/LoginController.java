package ProjectDoge.StudentSoup.controller.member;

import ProjectDoge.StudentSoup.dto.member.MemberLoginRequestDto;
import ProjectDoge.StudentSoup.service.member.MemberLoginService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class LoginController {

    private final MemberLoginService memberLoginService;

    @Value("${cookie.accessTime}")
    private int accessTokenMaxAge;

    @Value("${cookie.refreshTime}")
    private int refreshTokenMaxAge;

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody MemberLoginRequestDto dto, HttpServletResponse response){
        Map<String,String> token = memberLoginService.login(dto.getId(), dto.getPwd());
        Cookie accessTokenCookie = new Cookie("accessToken", token.get("accessToken"));
        Cookie refreshTokenCookie = new Cookie("refreshToken", token.get("refreshToken"));
        accessTokenCookie.setMaxAge(accessTokenMaxAge);
        refreshTokenCookie.setMaxAge(refreshTokenMaxAge);

        accessTokenCookie.setPath("/");
        refreshTokenCookie.setPath("/");
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().body(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Result<String>> logout(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if(session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(new Result<String>("ok"));
    }

    @Getter
    static class Result<T> {
        private final T data;

        public Result(T data){
            this.data = data;
        }
    }
}
