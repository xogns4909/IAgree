package ProjectDoge.StudentSoup.controller.admin;


import ProjectDoge.StudentSoup.dto.restaurant.RestaurantDto;
import ProjectDoge.StudentSoup.dto.restaurant.RestaurantFormDto;
import ProjectDoge.StudentSoup.dto.restaurant.RestaurantUpdateDto;
import ProjectDoge.StudentSoup.entity.restaurant.Restaurant;
import ProjectDoge.StudentSoup.entity.restaurant.RestaurantCategory;
import ProjectDoge.StudentSoup.entity.school.School;
import ProjectDoge.StudentSoup.repository.restaurant.RestaurantRepository;
import ProjectDoge.StudentSoup.repository.school.SchoolRepository;
import ProjectDoge.StudentSoup.service.admin.AdminRestaurantService;
import ProjectDoge.StudentSoup.service.restaurant.RestaurantRegisterService;
import ProjectDoge.StudentSoup.service.school.SchoolFindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminRestaurantController {

    private final RestaurantRegisterService restaurantRegisterService;
    private final AdminRestaurantService adminRestaurantService;
    private final SchoolRepository schoolRepository;

    private final RestaurantRepository restaurantRepository;

    private final SchoolFindService schoolFindService;
    @GetMapping("admin/restaurant")
    public List<Object> createRestaurant() {
        List<Map<String,Long>> schoolsDto = new ArrayList<>();
        List<Object> result = new ArrayList<>();
        List<School> schools = schoolRepository.findAll();
        for(School s : schools){
            Map<String,Long> dto = new HashMap<>();
            dto.put(s.getSchoolName(),s.getId());
            schoolsDto.add(dto);
        }
        RestaurantCategory[] values = RestaurantCategory.values();
        result.add(values);
        result.add(schoolsDto);
        return result;
    }

    @PostMapping("admin/restaurant")
    public String createRestaurant(RestaurantFormDto restaurantFormDto) {
        Long restaurantId = restaurantRegisterService.join(restaurantFormDto);
        return ResponseEntity.ok().body(restaurantId).toString();
    }

    @GetMapping("admin/restaurants")
    public ResponseEntity<Map<String,List<RestaurantDto>>> restaurantList() {
        Map<String,List<RestaurantDto>> result = new HashMap<>();
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<RestaurantDto> restaurantDtos = new ArrayList<>();
        for(Restaurant restaurant : restaurants){
            restaurantDtos.add(new RestaurantDto().createRestaurantDto(restaurant,false));
        }
        result.put("restaurants",restaurantDtos);
        return ResponseEntity.ok(result);
    }

    @GetMapping("admin/restaurant/edit/{restaurantId}")
    public List<Object> editRestaurant(@PathVariable Long restaurantId) {
        RestaurantUpdateDto restaurantFormDto = adminRestaurantService.adminFindUpdateRestaurant(restaurantId);
        List<Object> result = new ArrayList<>();
        result.add(restaurantId);
        result.add(restaurantFormDto);
        result.add(RestaurantCategory.values());

        return result;
    }

    @PostMapping("admin/restaurant/edit/{restaurantId}")
    public ResponseEntity<Long> editRestaurant(@PathVariable Long restaurantId,
                                 RestaurantUpdateDto restaurantUpdateDto) {
        adminRestaurantService.adminUpdateRestaurant(restaurantId, restaurantUpdateDto);
        return ResponseEntity.ok(restaurantId);
    }
    @GetMapping("admin/restaurant/{restaurantId}")
    public ResponseEntity<Long> deleteRestaurant(@PathVariable Long restaurantId){
        adminRestaurantService.adminDeleteRestaurant(restaurantId);
        return ResponseEntity.ok(restaurantId);
    }
}
