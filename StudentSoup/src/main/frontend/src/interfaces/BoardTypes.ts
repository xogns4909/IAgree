import { type userInformationType } from './UserTypes';

export interface BoardDataType {
  [key: string]: string | number | undefined;
  authentication: string;
  boardCategory: string;
  boardId: number;
  likedCount: number;
  nickname: string;
  reviewCount: string;
  tag: string;
  title: string;
  view: number;
  writeDate: string;
}

export interface PostSearchPropsType {
  pageTitle: string;
  handlePostBoardApi: (search: string) => void;
  userInformation: userInformationType;
}

export interface TableProps {
  headings: string[];
  data: BoardDataType[];
  userInformation: userInformationType;
}

export interface TableHeadTextType {
  [key: string]: string | undefined;
  title: string;
  authentication?: string;
  writeDate: string;
  view?: string;
}

export interface NoticeAndServiceProps {
  items: BoardDataType[];
  currentPage: number;
  count: number;
  handlePageChange: React.Dispatch<React.SetStateAction<number>>;
  postPerPage: number;
  pageTitle: string;
  tableHeader: string[];
  handlePostBoardApi: (search: string) => void;
  userInformation: userInformationType;
}

export interface BoardDepartmentType {
  departmentId: number;
  departmentName: string;
}

export interface BoardPropsType {
  currentPage: number;
  category: string;
  bestBoardItems: BoardDataType[];
  hotBoardItems: BoardDataType[];
  currentPosts: BoardDataType[];
  setSorted?: React.Dispatch<React.SetStateAction<number>>;
  userInformation: userInformationType[];
}

export interface BoardSearchType {
  handleSearchButton: (
    departmentId: number | null,
    selected: string | undefined,
    searched: string | undefined,
    sorted?: number,
  ) => void;
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  searched: string | undefined;
  setSearched: React.Dispatch<React.SetStateAction<string>>;
  departmentId: number | null;
  userInformation: userInformationType;
}
