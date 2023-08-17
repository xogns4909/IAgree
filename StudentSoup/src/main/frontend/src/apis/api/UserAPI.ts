import axiosInstance from 'apis/utils/AxiosInterceptor';
import axios, { type AxiosResponse } from 'axios';

export const getUserInformation = async () => {
  return await axiosInstance.post('/member/info');
};

export const getSchoolList = async (): Promise<AxiosResponse> => {
  const res = await axios.get('/members/signUp/3');
  return res;
};
// 학교키값, 학교이름 렌더링

export const getDepartment = async (schoolId: number): Promise<AxiosResponse> => {
  const res = await axios.post(`/members/signUp/3/${schoolId}`);
  return res;
};
// 학과 렌더링

export const editUserProfile = async (memberId: number, id: string, pwd: string) => {
  const response = await axiosInstance.post(`/members/edit/${memberId}/validation`, {
    memberId,
    id,
    pwd,
  });
  return response.data;
};
// 마이페이지 회원 정보 수정시 아이디 비밀번호 검증

export const editUserNickname = async (
  memberId: number,
  schoolId: number,
  departmentId: number,
  id: string,
  nickname: string,
  email: string,
  pwd?: string,
) => {
  const response = await axiosInstance.post(`/members/edit/${memberId}`, {
    memberId,
    schoolId,
    departmentId,
    id,
    nickname,
    email,
    pwd,
  });
  return response.data;
};
// 회원 닉네임 및 비밀번호 학교 및 전공 이메일 수정 통합

export const imageUpload = async (memberId: number, multipartFile: File) => {
  return await axiosInstance.post(
    '/members/edit/image',
    {
      memberId,
      multipartFile,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};
// 이미지 업로드

export const imageDelete = async (memberId: number) => {
  return await axiosInstance.delete('/members/delete/image', { params: { memberId } });
};
// 프로필 이미지 기본으로 변경
