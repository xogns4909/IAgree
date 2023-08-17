import axiosInstance from 'apis/utils/AxiosInterceptor';
import {
  type PreViewReplyResponse,
  type PreViewBoardResponse,
  type PreviewReviewResponse,
  type DetailCountResponse,
} from 'interfaces/MyPageTypes';

export const preViewBoard = async (
  memberId: number,
  page: number = 0,
  size: number = 3,
): Promise<PreViewBoardResponse> => {
  const response = await axiosInstance.post(
    '/mypage/board',
    {
      memberId,
    },
    { params: { page, size } },
  );

  return response.data;
};

export const preViewReply = async (
  memberId: number,
  page: number = 0,
  size: number = 3,
): Promise<PreViewReplyResponse> => {
  const response = await axiosInstance.post(
    '/mypage/boardReply',
    {
      memberId,
    },
    { params: { page, size } },
  );

  return response.data;
};

export const preViewReview = async (
  memberId: number,
  filter: string = '',
  page: number = 0,
  size: number = 3,
): Promise<PreviewReviewResponse> => {
  const response = await axiosInstance.post(
    '/mypage/restaurantReview',
    {
      memberId,
    },
    { params: { filter, page, size } },
  );

  return response.data;
};

export const detailCount = async (memberId: number): Promise<DetailCountResponse> => {
  const response = await axiosInstance.post('/mypage/detail', { memberId });
  return response.data;
};

export const editReview = async (
  memberId: number,
  restaurantReviewId: number,
  content: string,
  starLiked: number,
) => {
  const response = await axiosInstance.patch(
    `/restaurantReview/${memberId}/${restaurantReviewId}`,
    { content, starLiked },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
