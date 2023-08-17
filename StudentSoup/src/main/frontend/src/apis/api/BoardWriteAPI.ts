import axiosInstance from 'apis/utils/AxiosInterceptor';
import { async } from 'q';

// 게시글 작성시 학과목록 불러오기
export const WriteDepartmentData = async (memberId: number, schoolId: number) => {
  const response = await axiosInstance.get(`/board/create/${memberId}/${schoolId}`);
  return response.data;
};

// 게시글 등록

export const PostRegistration = async (
  memberId: number,
  title: string,
  boardCategory: string,
  content: string,
  departmentId: number | null,
  mutipartFileList?: File,
) => {
  const response = await axiosInstance.put(
    `/board/${memberId}`,
    {
      memberId,
      departmentId,
      title,
      boardCategory,
      content,
      mutipartFileList: null,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 임시 게시글 페이지 렌더링

export const PP = async (boardId: number, memberId: number) => {
  const response = await axiosInstance.post(`/board/detail/${boardId}/${memberId}`);
  return response.data;
};

// 임시 이미지파일 저장

export const UploadImgURL = async (memberId: number, multipartFileList: File) => {
  const response = await axiosInstance.post(
    `/board/image/${memberId}`,
    {
      multipartFileList,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 임시 이미지파일 호출
export const GetUploadImgURL = async (memberId: number) => {
  const response = await axiosInstance.get(`/board/image/${memberId}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 게시글 수정 데이터 호출
export const GetBoardEditData = async (boardId: number, memberId: number) => {
  const response = await axiosInstance.get(`/board/${boardId}/${memberId}`);
  return response.data;
};

// 게시글 수정완료 데이터 호출
export const BoardEdited = async (
  boardId: number,
  memberId: number,
  title: string,
  boardCategory: string,
  content: string,
  departmentId: number | null,
  mutipartFileList?: File,
) => {
  const response = await axiosInstance.patch(
    `/board/${boardId}/${memberId}`,
    {
      departmentId,
      title,
      boardCategory,
      content,
      mutipartFileList: null,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
