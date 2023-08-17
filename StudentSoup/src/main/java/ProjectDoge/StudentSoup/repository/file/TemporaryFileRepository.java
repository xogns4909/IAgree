package ProjectDoge.StudentSoup.repository.file;

import ProjectDoge.StudentSoup.entity.file.TemporaryImageFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemporaryFileRepository extends JpaRepository<TemporaryImageFile,Long>,TemporaryFileRepositoryCustom {
}
