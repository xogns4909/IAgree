package ProjectDoge.StudentSoup.controller.board;

import ProjectDoge.StudentSoup.dto.board.BoardFormDto;
import ProjectDoge.StudentSoup.dto.board.BoardUpdateDto;
import ProjectDoge.StudentSoup.service.board.BoardUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BoardUpdateController {
    private final BoardUpdateService boardUpdateService;

    @GetMapping("/board/{boardId}/{memberId}")
    public BoardUpdateDto updateBoard(@PathVariable Long boardId,@PathVariable Long memberId){
        BoardUpdateDto boardUpdateDto = boardUpdateService.findEditBoard(boardId,memberId);
        return boardUpdateDto;
    }
    @PatchMapping(value = "/board/{boardId}/{memberId}",consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ConcurrentHashMap<String,Object> updateBoard(@PathVariable Long boardId,
                                         @PathVariable Long memberId,
                                         BoardFormDto boardFormDto
                            ){
        ConcurrentHashMap<String,Object> resultMap = new ConcurrentHashMap<>();
        boardUpdateService.editBoard(boardFormDto, boardId, memberId, boardFormDto.getMultipartFileList());
        resultMap.put("boardId",boardId);
        resultMap.put("result","ok");
        return resultMap;
    }
}
