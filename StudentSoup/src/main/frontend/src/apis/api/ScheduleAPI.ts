import axiosInstance from 'apis/utils/AxiosInterceptor';

// 시간표 등록
export const addSchedule = async (
  memberId: number,
  dayOfWeek: string,
  startTime: number,
  endTime: number,
  color: string,
  subject: string,
) => {
  const response = await axiosInstance.put(`/schedule/${memberId}`, {
    dayOfWeek,
    startTime,
    endTime,
    color,
    subject,
  });
  return response.data;
};

// 시간표 조회
export const viewSchedule = async (memberId: number) => {
  const response = await axiosInstance.post(`/schedule/${memberId}`);
  return response.data;
};

// 시간표 수정
export const editSchedule = async (
  memberId: number,
  scheduleId: number,
  dayOfWeek: string,
  startTime: number,
  endTime: number,
  color: string,
  subject: string,
) => {
  const response = await axiosInstance.patch(`/schedule/${memberId}`, {
    scheduleId,
    dayOfWeek,
    startTime,
    endTime,
    color,
    subject,
  });
  return response.data;
};

// 시간표 삭제
export const deleteSchedule = async (scheduleId: number) => {
  const response = await axiosInstance.delete(`/schedule/${scheduleId}`);
  return response.data;
};
