package ProjectDoge.StudentSoup.dto.school;

import ProjectDoge.StudentSoup.entity.school.School;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
public class SchoolFormDto {

    @NotEmpty(message = "학교 입력은 필수 입니다.")
    private String schoolName;
    private String schoolCoordinate;

    @NotEmpty(message = "이메일 입력은 필수 입니다.")
    private String schoolEmail;

    //== 생성 메서드 ==//
    public void setSchool(School school){
        this.setSchoolName(school.getSchoolName());
        this.setSchoolCoordinate(school.getSchoolCoordinate());
        this.setSchoolEmail(school.getSchoolEmail());
    }
}
