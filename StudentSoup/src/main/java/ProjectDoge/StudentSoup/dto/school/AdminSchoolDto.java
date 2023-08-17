package ProjectDoge.StudentSoup.dto.school;

import ProjectDoge.StudentSoup.entity.school.School;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminSchoolDto {

    private Long schoolId;
    private String schoolName;

    private String schoolCoordinate;

    private String schoolEmail;



    //== 생성 메서드 ==//
    public AdminSchoolDto getSchoolDto(School school){
        this.schoolId = school.getId();
        this.schoolName = (school.getSchoolName());
        this.schoolCoordinate = (school.getSchoolCoordinate());
        this.schoolEmail = (school.getSchoolEmail());

        return this;
    }
}
