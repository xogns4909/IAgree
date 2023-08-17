package ProjectDoge.StudentSoup.dto.restaurant;

import ProjectDoge.StudentSoup.entity.restaurant.Restaurant;
import ProjectDoge.StudentSoup.entity.restaurant.RestaurantCategory;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class RestaurantUpdateDto {
    @NotEmpty(message = "레스토랑 입력은 필수입니다.")
    private String name;

    private String address;

    private RestaurantCategory restaurantCategory;

    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @NotNull(message = "시작시간 입력은 필수입니다.")
    private LocalTime startTime;

    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @NotNull(message = "종료시간 입력은 필수입니다.")
    private LocalTime endTime;

    private String schoolName;

    private String coordinate;

    private List<MultipartFile> multipartFileList = new ArrayList<>();

    @NotEmpty(message = "가게번호 입력은 필수 입니다.")
    private String tel;

    private String tag;

    private String detail;


    //== 생성 메서드 ==//
    public void setRestaurant(Restaurant restaurant){
        this.setName(restaurant.getName());
        this.setAddress(restaurant.getAddress());
        this.setRestaurantCategory(restaurant.getRestaurantCategory());
        this.setStartTime(restaurant.getStartTime());
        this.setEndTime(restaurant.getEndTime());
        this.setSchoolName(restaurant.getSchool().getSchoolName());
        this.setCoordinate(restaurant.getCoordinate());
        this.setTel(restaurant.getTel());
        this.setTag(restaurant.getTag());
        this.setDetail(restaurant.getDetail());
    }

    public void createRestaurantFormDto(String name, String address, RestaurantCategory category, LocalTime startTime, LocalTime endTime,String schoolName, String coordinate, List<MultipartFile> multipartFileList, String tel, String tag, String detail) {
        this.name = name;
        this.address=address;
        this.restaurantCategory=category;
        this.startTime= startTime;
        this.endTime= endTime;
        this.schoolName = schoolName;
        this.coordinate=coordinate;
        this.tel=tel;
        this.tag=tag;
        this.detail=detail;
    }
}
