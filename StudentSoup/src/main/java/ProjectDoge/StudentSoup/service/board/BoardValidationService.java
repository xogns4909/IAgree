package ProjectDoge.StudentSoup.service.board;

import ProjectDoge.StudentSoup.dto.board.BoardFormDto;
import ProjectDoge.StudentSoup.entity.board.BoardCategory;
import ProjectDoge.StudentSoup.entity.member.Member;
import ProjectDoge.StudentSoup.entity.member.MemberClassification;
import ProjectDoge.StudentSoup.exception.board.BoardNotQualifiedException;
import ProjectDoge.StudentSoup.exception.board.BoardTitleOutOfRangeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BoardValidationService {

    public void checkValidation(BoardFormDto boardFormDto, Member member){
        checkQualification(boardFormDto.getBoardCategory(), member.getMemberClassification());
        checkBoardTitleLength(boardFormDto.getTitle());
    }

    private void checkQualification(BoardCategory category, MemberClassification classification) {
        if(category == BoardCategory.ANNOUNCEMENT && classification != MemberClassification.ADMIN){
            throw new BoardNotQualifiedException("공지사항은 관리자만 작성 가능합니다.");
        }
    }

    private void checkBoardTitleLength(String title){
        if(title.length() < 2 || title.length() > 50)
            throw new BoardTitleOutOfRangeException("게시글의 제목은 2자 이상 50자 이하여야 합니다.");
    }

}
