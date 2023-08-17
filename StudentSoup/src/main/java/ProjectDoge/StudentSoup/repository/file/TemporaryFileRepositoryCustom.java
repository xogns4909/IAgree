package ProjectDoge.StudentSoup.repository.file;


import ProjectDoge.StudentSoup.entity.file.TemporaryImageFile;

import java.util.List;

public interface TemporaryFileRepositoryCustom {

    public List<TemporaryImageFile>  findByMemberId(Long memberId);
    public List<String> findFileNames(Long memberId);
}
