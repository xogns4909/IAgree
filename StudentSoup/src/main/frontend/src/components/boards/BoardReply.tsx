import './boardReply.scss';
import Circle_human from '../../img/circle_human.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faHeart, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { Desktop, Mobile } from '../../mediaQuery';
import BoardReplyFunction from './BoardReplyFunction';

interface Props {
  reply: any;
  memberId: number;
  nickname: string;
  getBoardId: number;
}

const BoardReply = ({ reply, memberId, nickname, getBoardId }: Props) => {
  return (
    <>
      <Desktop>
        {reply.map((reply: any) => (
          <div
            key={reply.boardReplyId}
            id={reply.boardReplyId}
            className="board-detail-bottom-reply-div"
          >
            <BoardReplyFunction
              reply={reply}
              memberId={memberId}
              nickname={nickname}
              getBoardId={getBoardId}
            />
            <div className="board-detail-underline" />
          </div>
        ))}
      </Desktop>
      <Mobile>
        {reply.map((reply: any) => (
          <div
            key={reply.boardReplyId}
            id={reply.boardReplyId}
            className="board-detail-mobile-bottom-reply-div"
          >
            <BoardReplyFunction
              reply={reply}
              memberId={memberId}
              nickname={nickname}
              getBoardId={getBoardId}
            />
            <div className="board-detail-mobile-underline" />
          </div>
        ))}
      </Mobile>
    </>
  );
};

export default BoardReply;
