package ProjectDoge.StudentSoup.controller.jwt;

import ProjectDoge.StudentSoup.service.jwt.GetNewAccessTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequiredArgsConstructor
public class JwtController {

    private final GetNewAccessTokenService getRefreshTokenService;


    @PostMapping("/jwt")
    public String newToken(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        String refreshToken = getRefreshTokenService.findRefreshToken(token);
        return refreshToken;
    }
}
