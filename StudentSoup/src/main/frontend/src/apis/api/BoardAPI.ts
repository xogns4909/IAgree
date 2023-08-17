import axios, { type AxiosResponse } from 'axios';
import axiosInstance from '../utils/AxiosInterceptor';

export const postBoardCategory = async (
  category: string,
  page: number,
  size: number = 12,
  search: string = '',
): Promise<AxiosResponse> => {
  const response = await axios.post(`/board/${category}?title=${search}`, { page, size });
  return response;
};

export const postUserInfo = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('/member/info');
  return response;
};

export const postBoards = async (
  schoolId: number,
  memberId: number,
  departmentId: number | null = null,
  column: string | null = null,
  value: string | null = null,
  category: string,
  sorted: number = 0,
  page: number,
  size: number = 12,
) => {
  const response = await axiosInstance.post(
    `/boards?category=${category}&column=${column}&value=${value}&sorted=${sorted}&page=${page}&size=${size}`,
    {
      schoolId,
      memberId,
      departmentId,
    },
  );
  return response;
};

export const getDepartmentBoards = async (schoolId: number) => {
  const response = await axiosInstance.get(`/board/department/${schoolId}`);
  return response;
};

export const postBoardDetail = async (boardId: number, memberId: number | null) => {
  const response = await axios.post(`/board/detail/${boardId}/${memberId}`);
  return response;
};

export const getBoardReplies = async (boardId: number, memberId: number | null) => {
  const response = await axiosInstance.get(`/boardReplies/${boardId}/${memberId}`);
  return response;
};

export const putBoardReply = async (
  boardId: number,
  memberId: number,
  content: string,
  level: number,
  reply: number,
) => {
  const response = await axiosInstance.put('/boardReply', {
    boardId,
    memberId,
    content,
    level,
    seq: reply,
  });
  return response;
};
