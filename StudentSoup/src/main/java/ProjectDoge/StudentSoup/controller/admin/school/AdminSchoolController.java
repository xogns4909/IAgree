package ProjectDoge.StudentSoup.controller.admin.school;

import ProjectDoge.StudentSoup.dto.school.AdminSchoolDto;
import ProjectDoge.StudentSoup.dto.school.SchoolFormDto;
import ProjectDoge.StudentSoup.entity.school.School;
import ProjectDoge.StudentSoup.repository.school.SchoolRepository;
import ProjectDoge.StudentSoup.service.admin.AdminSchoolService;
import ProjectDoge.StudentSoup.service.school.SchoolFindService;
import ProjectDoge.StudentSoup.service.school.SchoolRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AdminSchoolController {
    private final SchoolFindService schoolFindService;
    private final SchoolRegisterService schoolRegisterService;
    private final AdminSchoolService adminSchoolService;
    private final SchoolRepository schoolRepository;

    @PostMapping("admin/school")
    public ResponseEntity createSchool(@RequestBody SchoolFormDto schoolFormDto){
        Long schoolId = schoolRegisterService.join(schoolFormDto);
        return new ResponseEntity(schoolId,HttpStatus.valueOf(201));
    }

//    @GetMapping("admin/school/new")
//    public String createSchool(){
//        model.addAttribute("schoolForm",new SchoolFormDto());
//        return "/admin/school/createSchool";
//    }
    @PostMapping("admin/school/new")
    public String createSchool(@Valid SchoolFormDto formDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.badRequest().toString();
        }
        Long schoolId = schoolRegisterService.join(formDto);
        return schoolId.toString();
    }
    @GetMapping("/admin/schools")
    public Map<String,List<AdminSchoolDto>> schoolList() {
        Map<String,List<AdminSchoolDto>> result = new HashMap<>();
        List<School> schools = schoolFindService.findAll();

        List<AdminSchoolDto> schoolDtos = schoolFindService.getSchoolDtoList(schools);
        result.put("schools",schoolDtos);
        return result;
    }
    @GetMapping("/admin/school/edit")
    public SchoolFormDto editSchool(@RequestParam("schoolId")Long schoolId){
        SchoolFormDto updateSchool = adminSchoolService.AdminFindUpdateSchool(schoolId);
        return updateSchool;
}
    @PostMapping("/admin/school/edit")
    public ResponseEntity<Long> editSchool(@RequestParam("schoolId")Long schoolId,@RequestBody() SchoolFormDto schoolFormDto){
        adminSchoolService.AdminUpdateSchool(schoolId,schoolFormDto);
        return ResponseEntity.ok().body(schoolId);
    }
    @GetMapping("/admin/school/delete")
    public ResponseEntity<Long> deleteSchool(@RequestParam("schoolId")Long schoolId){
        schoolRepository.deleteById(schoolId);
        return ResponseEntity.ok(schoolId);
    }


}
