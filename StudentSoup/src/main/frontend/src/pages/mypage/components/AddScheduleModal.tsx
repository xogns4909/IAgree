import React, { useEffect, useState } from 'react';
import './addScheduleModal.scss';
import Swal from 'sweetalert2';
import { getUserInformation } from 'apis/api/UserAPI';
import { type ScheduleItem } from '../MypageScheduler';
import { addSchedule, editSchedule } from 'apis/api/ScheduleAPI';

interface Props {
  onSubmit: (
    dayOfWeek: string,
    startTime: number,
    endTime: number,
    color: string,
    subject: string,
    scheduleId: number,
  ) => void;
  onCancel: () => void;

  existingItems: Array<{ dayOfWeek: string; startTime: number; endTime: number }>;
  editItem?: ScheduleItem;
}

const AddScheduleModal: React.FC<Props> = ({ onSubmit, onCancel, existingItems, editItem }) => {
  const [memberId, setMemberId] = useState<number>();
  const [dayOfWeek, setDayOfWeek] = useState<string>('Mon');
  const [startTime, setStartTime] = useState<number>(1);
  const [endTime, setEndTime] = useState<number>(1);
  const [color, setColor] = useState<string>('#000000');
  const [subject, setSubject] = useState<string>('');
  const [scheduleId, setScheduleId] = useState<number>();
  const [initialEditItem, setInitialEditItem] = useState<ScheduleItem | undefined>(editItem);

  useEffect(() => {
    getUserInformation()
      .then(res => {
        setMemberId(res.data.memberId);
      })
      .catch(err => {
        console.error(err);
      });
    if (editItem) {
      setScheduleId(editItem.scheduleId);
      setDayOfWeek(editItem.dayOfWeek);
      setStartTime(editItem.startTime);
      setEndTime(editItem.endTime);
      setColor(editItem.color);
      setSubject(editItem.subject);
    }
    setInitialEditItem(editItem);
  }, [editItem]);

  const handleSubmit = async () => {
    if (subject === '' || subject === undefined) {
      alert('과목이름을 입력해주세요');
      return;
    }
    if (memberId) {
      if (editItem) {
        editSchedule(memberId, editItem.scheduleId, dayOfWeek, startTime, endTime, color, subject)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '시간표 수정 완료',
              text: '시간표가 성공적으로 수정되었습니다.',
              timer: 3000,
              showConfirmButton: true,
              confirmButtonText: '확인',
              showCancelButton: false,
              timerProgressBar: true,
            });
            onSubmit(dayOfWeek, startTime, endTime, color, subject, editItem.scheduleId);
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      } else {
        const newScheduleId = await addSchedule(
          memberId,
          dayOfWeek,
          startTime,
          endTime,
          color,
          subject,
        )
          .then(res => {
            setScheduleId(res);
            Swal.fire({
              icon: 'success',
              title: '시간표 등록 완료',
              text: '시간표가 성공적으로 등록되었습니다.',
              timer: 3000,
              showConfirmButton: true,
              confirmButtonText: '확인',
              showCancelButton: false,
              timerProgressBar: true,
            });
            onSubmit(dayOfWeek, startTime, endTime, color, subject, res);
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      }
    }
  };
  const handleCancel = () => {
    if (initialEditItem) {
      setScheduleId(initialEditItem.scheduleId);
      setDayOfWeek(initialEditItem.dayOfWeek);
      setStartTime(initialEditItem.startTime);
      setEndTime(initialEditItem.endTime);
      setColor(initialEditItem.color);
      setSubject(initialEditItem.subject);
    } else {
      setScheduleId(undefined);
      setDayOfWeek('Mon');
      setStartTime(1);
      setEndTime(1);
      setColor('#000000');
      setSubject('');
    }
    onCancel();
  };

  return (
    <div className="add-schedule-modal">
      <div className="add-schedule-modal-field">
        <div className="add-schedule-modal-label">요일:</div>
        <select
          className="add-schedule-modal-select"
          id="dayOfWeek"
          value={dayOfWeek}
          onChange={e => setDayOfWeek(e.target.value)}
        >
          <option value="Mon">월요일</option>
          <option value="Tue">화요일</option>
          <option value="Wed">수요일</option>
          <option value="Thu">목요일</option>
          <option value="Fri">금요일</option>
        </select>
      </div>
      <div className="add-schedule-modal-field">
        <div className="add-schedule-modal-label">시작 시간:</div>
        <select
          className="add-schedule-modal-select"
          id="start-time"
          value={startTime}
          onChange={e => {
            const selectedStartTime = parseInt(e.target.value);
            setStartTime(selectedStartTime);
            if (endTime < selectedStartTime) {
              setEndTime(selectedStartTime);
            }
          }}
        >
          {[...Array(15)].map((_, i) => (
            <option key={`start-time-${i}`} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="add-schedule-modal-field">
        <div className="add-schedule-modal-label">종료 시간:</div>
        <select
          className="add-schedule-modal-select"
          id="end-time"
          value={endTime}
          onChange={e => {
            const selectedEndTime = parseInt(e.target.value);
            setEndTime(selectedEndTime);
            if (selectedEndTime < startTime) {
              setStartTime(selectedEndTime);
            }
          }}
        >
          {[...Array(16 - startTime)].map((_, i) => (
            <option key={`end-time-${i}`} value={i + startTime}>
              {i + startTime}
            </option>
          ))}
        </select>
      </div>
      <div className="add-schedule-modal-field">
        <div className="add-schedule-modal-label">색상:</div>
        <input type="color" id="color" value={color} onChange={e => setColor(e.target.value)} />
      </div>
      <div className="add-schedule-modal-field">
        <div className="add-schedule-modal-label">과목이름:</div>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>
      <div className="add-schedule-modal-footer">
        <button className="add-schedule-modal-cancel-button" onClick={handleCancel}>
          취소
        </button>
        <button className="add-schedule-modal-save-button" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
};
export default AddScheduleModal;
