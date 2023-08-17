package ProjectDoge.StudentSoup.service.board;

import ProjectDoge.StudentSoup.dto.file.UploadFileDto;
import ProjectDoge.StudentSoup.entity.file.TemporaryImageFile;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.repository.file.TemporaryFileRepository;
import ProjectDoge.StudentSoup.service.file.FileService;
import ProjectDoge.StudentSoup.service.member.MemberFindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardTemporaryFileService {

    private final FileService fileService;

    private final MemberFindService memberFindService;

    private final TemporaryFileRepository temporaryFileRepository;

    @Transactional
    public  String join(Long memberId,List<MultipartFile> multipartFileList){
        Member member = memberFindService.findOne(memberId);
        deleteImage(memberId);
        List<UploadFileDto> uploadFileDtoList = fileService.createUploadFileDtoList(multipartFileList);
        uploadTemporaryImage(member,uploadFileDtoList);

        return "ok";
    }

    public String deleteImage(Long memberId) {
        List<TemporaryImageFile> imageList = temporaryFileRepository.findByMemberId(memberId);
        for (TemporaryImageFile temporaryImageFile : imageList) {
            fileService.deleteFile(temporaryImageFile);
            temporaryFileRepository.delete(temporaryImageFile);
        }
        return "ok";
    }

    public List<String> callImageList(Long memberId){
        return temporaryFileRepository.findFileNames(memberId);
    }

    private void uploadTemporaryImage(Member member, List<UploadFileDto> uploadFileDtoList) {
        log.info("임시 사진 저장 서비스가 시작되었습니다.");
        for (UploadFileDto uploadFileDto : uploadFileDtoList) {
            TemporaryImageFile file = new TemporaryImageFile().createFile(uploadFileDto);
            log.info("name = {} origin = {} url = {}",file.getFileName(),file.getFileOriginalName(),file.getFileUrl());
            member.addImageFile(temporaryFileRepository.save(file));
        }
    }

}
