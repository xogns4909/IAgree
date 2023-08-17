package ProjectDoge.StudentSoup.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberEmailAuthenticationDto {

    private String email;

    private Integer authenticationNumber;

}
