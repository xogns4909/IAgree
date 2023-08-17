package ProjectDoge.StudentSoup.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@Configuration
@Slf4j
public class JwtExceptionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            log.info("111111");
            filterChain.doFilter(request,response);
        }
        catch (JwtException e){
            setErrorResponse(request,response,e);
            log.info("222222");
        }
    }
    public void setErrorResponse(HttpServletRequest request,HttpServletResponse response,Exception e) throws IOException{
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        final Map<String,Object> body = new HashMap<>();
        body.put("status",HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error","UNAUTHORIZED");
        body.put("message",e.getMessage());
        body.put("path",request.getServletPath());
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getOutputStream(),body);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
