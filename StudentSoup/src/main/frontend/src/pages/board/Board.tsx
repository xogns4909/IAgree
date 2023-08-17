import react, { useEffect, useState } from 'react';
import './board.scss';
import BoardSearch from '../../components/common/BoardSearch';
import Paginate from '../../components/common/Paginate';
import { Desktop, Mobile } from '../../mediaQuery';
import { getDepartmentBoards, postBoards } from '../../apis/api/BoardAPI';
import PCBoard from './components/PcBoard';
import MobileBoard from './components/MobileBoard';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { type BoardDepartmentType, type BoardDataType } from '../../interfaces/BoardTypes';

const Board = () => {
  const [category, setCategory] = useState<string>('ALL');
  const [boardName, setBoardName] = useState<string>('');

  const [bestBoardItems, setBestBoardItems] = useState<BoardDataType[]>([]);
  const [hotBoardItems, setHotBoardItems] = useState<BoardDataType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postPerPage, setPostPerPage] = useState<number>(0);
  const [currentPosts, setCurrentPosts] = useState<BoardDataType[]>([]);
  const [selected, setSelected] = useState<string>('all');
  const [searched, setSearched] = useState<string>('');
  const [sorted, setSorted] = useState<number>(0);
  const [departmentOption, setDepartmentOption] = useState<BoardDepartmentType[]>();

  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const userInformation = { ...location.state };

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });

  const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectDepartment = Number(e.target.value);
    const selectBoardName = e.target.options[e.target.selectedIndex].text;

    setDepartmentId(selectDepartment);
    setBoardName(selectBoardName);
  };

  const handleClickCategory = (e: React.MouseEvent<HTMLLIElement>) => {
    setCategory(e.currentTarget.id);
    setCurrentPage(1);
    setSelected('all');
    setSearched('');
  };

  const handlePageChange = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  const handleSearchButton = (
    departmentId: number | null,
    selected: string | undefined,
    searched: string | undefined,
    sorted: number = 0,
  ) => {
    localStorage.getItem('access-token') &&
      postBoards(
        userInformation.schoolId,
        userInformation.memberId,
        departmentId,
        selected,
        searched,
        category,
        sorted,
        currentPage - 1,
      )
        .then(res => {
          if (category === 'ALL') {
            setBestBoardItems(res.data.bestBoards);
            setHotBoardItems(res.data.hotBoards);
            setPostPerPage(res.data.boards.pageable.pageSize);
            setCount(res.data.boards.totalElements);
            setCurrentPosts(res.data.boards.content);
          } else {
            setPostPerPage(res.data.boards.pageable.pageSize);
            setCount(res.data.boards.totalElements);
            setCurrentPosts(res.data.boards.content);
          }
        })
        .catch(() => {
          navigate('/');
          Swal.fire(
            '게시판 불러오기 실패',
            '게시판 불러오기가 실패되었습니다. 다시 시도해 주세요.',
            'error',
          );
        });
  };

  useEffect(() => {
    handleSearchButton(departmentId, selected, searched, sorted);
  }, [currentPage, category, boardName, departmentId, sorted]);

  useEffect(() => {
    if (localStorage.getItem('access-token') === null) {
      navigate('/');
      Toast.fire({
        icon: 'error',
        title: '로그인이 필요한 서비스입니다.',
      });
    } else {
      setBoardName(userInformation.schoolName);

      getDepartmentBoards(userInformation.schoolId).then(res => {
        setDepartmentOption(res.data);
      });
    }
  }, []);

  return (
    <div className="board-main">
      <div className="board-top-div">
        <div className="board-top-text-div">
          <div className="board-school-name">
            <span>{boardName} 게시판</span>
          </div>
          <div className='className="board-mobile-select-div"'>
            <select
              name="boardCategory"
              defaultValue={departmentId === null ? '' : departmentId.toString()}
              className="board-select-category"
              onChange={handleChangeOption}
            >
              <option value="null">전체게시판</option>
              {departmentOption?.map((department: BoardDepartmentType) => {
                return (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.departmentName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="board-lists-div">
          <ul className="board-lists">
            <li
              id="ALL"
              className={category.toString() === 'ALL' ? 'board-li active' : 'board-li'}
              onClick={handleClickCategory}
            >
              전체 게시판
            </li>
            <li
              id="FREE"
              className={category.toString() === 'FREE' ? 'board-li active' : 'board-li'}
              onClick={handleClickCategory}
            >
              자유 게시판
            </li>
            <li
              id="CONSULTING"
              className={category.toString() === 'CONSULTING' ? 'board-li active' : 'board-li'}
              onClick={handleClickCategory}
            >
              취업/상담 게시판
            </li>
            <li
              id="TIP"
              className={category.toString() === 'TIP' ? 'board-li active' : 'board-li'}
              onClick={handleClickCategory}
            >
              TIP 게시판
            </li>
          </ul>
        </div>
      </div>
      <div className="board-bottom-div">
        <div className="board-table-div">
          <Desktop>
            <PCBoard
              currentPage={currentPage}
              category={category}
              bestBoardItems={bestBoardItems}
              hotBoardItems={hotBoardItems}
              currentPosts={currentPosts}
              setSorted={setSorted}
              userInformation={userInformation}
            />
          </Desktop>
          <Mobile>
            <MobileBoard
              currentPage={currentPage}
              category={category}
              bestBoardItems={bestBoardItems}
              hotBoardItems={hotBoardItems}
              currentPosts={currentPosts}
              userInformation={userInformation}
            />
          </Mobile>
        </div>
        <Paginate
          page={currentPage}
          count={count}
          setPage={handlePageChange}
          postPerPage={postPerPage}
        />
        <BoardSearch
          handleSearchButton={handleSearchButton}
          selected={selected}
          setSelected={setSelected}
          searched={searched}
          setSearched={setSearched}
          departmentId={departmentId}
          userInformation={userInformation}
        />
      </div>
    </div>
  );
};
export default Board;
