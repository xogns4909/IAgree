package ProjectDoge.StudentSoup.config;

import ProjectDoge.StudentSoup.interceptor.AdminInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AdminConfig implements WebMvcConfigurer {

    @Autowired
    private AdminInterceptor adminInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminInterceptor)
                .order(0)  // 이 순서를 Spring Security 보다 먼저 실행되도록 설정
                .addPathPatterns("/admin/**")
                .excludePathPatterns("/css/**", "/*.ico", "/error", "/js/**");
    }
}