package ProjectDoge.StudentSoup.entity.file;

import ProjectDoge.StudentSoup.dto.file.UploadFileDto;
import ProjectDoge.StudentSoup.entity.member.Member;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class TemporaryImageFile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long  TemporaryImageId;

    @Column(name = "NAME")
    String fileName;

    @Column(name = "ORIGINAL_NAME")
    String fileOriginalName;

    @Column(name ="URL")
    String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    public void setMember(Member member){
        this.member = member;
    }
    public TemporaryImageFile createFile(UploadFileDto dto) {
        this.setFileName(dto.getStoreFileName());
        this.setFileOriginalName(dto.getOriginalFileName());
        this.setFileUrl(dto.getFileUrl());

        return this;
    }
}
