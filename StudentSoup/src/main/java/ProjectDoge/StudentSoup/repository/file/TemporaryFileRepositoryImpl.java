package ProjectDoge.StudentSoup.repository.file;

import ProjectDoge.StudentSoup.entity.file.TemporaryImageFile;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static ProjectDoge.StudentSoup.entity.file.QTemporaryImageFile.temporaryImageFile;

@RequiredArgsConstructor
public class TemporaryFileRepositoryImpl implements TemporaryFileRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<TemporaryImageFile> findByMemberId(Long memberId){
        return queryFactory.select(temporaryImageFile)
                .from(temporaryImageFile)
                .where(temporaryImageFile.member.memberId.eq(memberId))
                .fetch();
    }

    @Override
    public List<String> findFileNames(Long memberId){
        return queryFactory.select(temporaryImageFile.fileName)
                .from(temporaryImageFile)
                .where(temporaryImageFile.member.memberId.eq(memberId))
                .fetch();
    }

}
