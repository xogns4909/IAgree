package ProjectDoge.StudentSoup.service.jwt;

import ProjectDoge.StudentSoup.exception.jwt.ExpirationDateException;
import ProjectDoge.StudentSoup.service.redis.RedisUtil;
import ProjectDoge.StudentSoup.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetNewAccessTokenService {

    @Value("${jwt.refreshSecret}")
    private String refreshSecretKey;

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.token-validity-in-seconds}")
    private Long expireMs;

    @Value("${jwt.refreshToken-validity-in-seconds}")
    private Long redisExpireMs;
    private final RedisUtil redisUtil;

    private final JwtUtil jwtUtil;

    public String findRefreshToken(String refreshToken){
        log.info("refreshToken {}",refreshToken);

        if(refreshToken == null ){
            throw new ExpirationDateException("유효기간이 마감된 토큰입니다.");
        }
        jwtUtil.checkExpireDate(refreshToken,refreshSecretKey);

        String userId = jwtUtil.getUserName(refreshToken,refreshSecretKey);
        Claims claims = Jwts.claims();
        claims.put("userName",userId);
        String accessToken = JwtUtil.createAccessToken(secretKey, expireMs, claims);
        return accessToken;

        }
    }
