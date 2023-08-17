import React, { useEffect, useState } from 'react';
import './mypageScheduler.scss';
import { useNavigate } from 'react-router-dom';
import { DesktopHeader, MobileHeader, Mobile } from 'mediaQuery';
import MypageNavbar from 'components/common/MypageNavbar';
import MypagePlus from 'assets/images/mypagePlus.svg';
import AddScheduleModal from './components/AddScheduleModal';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router';
import { getUserInformation } from 'apis/api/UserAPI';
import { deleteSchedule, viewSchedule } from 'apis/api/ScheduleAPI';

export interface ScheduleItem {
  scheduleId: number;
  dayOfWeek: string;
  startTime: number;
  endTime: number;
  color: string;
  subject: string;
}

const MypageScheduler: React.FC = () => {
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState<string>('');
  const { state } = useLocation();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectPage, setSelectPage] = useState<string>('scheduler');
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  useEffect(() => {
    viewSchedule(state).then(res => {
      setScheduleItems(res);
    });
  }, []);
  useEffect(() => {
    setUserImg(userImg);
  }, [userImg]);
  useEffect(() => {
    getUserInformation()
      .then(res => {
        setUserImg(res.data.fileName);
      })
      .catch(() => {
        Toast.fire({
          icon: 'error',
          title: '로그인이 필요한 서비스입니다.',
        });
        navigate('/login');
      });
  }, []);
  const addScheduleItem = (
    scheduleId: number,
    dayOfWeek: string,
    startTime: number,
    endTime: number,
    color: string,
    subject: string,
  ) => {
    const newItem = { scheduleId, dayOfWeek, startTime, endTime, color, subject };
    setScheduleItems([...scheduleItems, newItem]);
  };
  const renderScheduleItem = (
    scheduleId: number,
    dayOfWeek: string,
    startTime: number,
    endTime: number,
    color: string,
    subject: string,
  ) => {
    const item: ScheduleItem = {
      dayOfWeek,
      startTime,
      endTime,
      color,
      subject,
      scheduleId,
    };
    const adjustColorLuminance = (color: string, lum: number) => {
      color = String(color).replace(/[^0-9a-f]/gi, '');
      if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
      }
      lum = lum || 0;

      let rgb = '#';
      for (let i = 0; i < 3; i++) {
        let c: number = parseInt(color.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + Math.round(c * lum)), 255));
        rgb += ('00' + c.toString(16)).slice(-2);
      }

      return rgb;
    };

    // 명도 조절 부분
    const adjustedColor = adjustColorLuminance(color, 0.4);

    const style: React.CSSProperties = {
      backgroundColor: adjustedColor,
      position: 'relative',
      zIndex: 1,
    };

    const rowSpan = Math.max(1, endTime - startTime + 1);
    style.height = `${rowSpan * 100}%`;
    const handleItemClick = async (item: ScheduleItem) => {
      const result = await Swal.fire({
        title: item.subject,
        showCancelButton: true,
        confirmButtonText: '수정',
        cancelButtonText: '삭제',
        cancelButtonColor: '#d33',
        reverseButtons: false,
      });

      if (result.isConfirmed) {
        setIsModalOpen(true);
        openEditModal(item);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        deleteSchedule(item.scheduleId)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '시간표 삭제 완료',
              text: '시간표가 성공적으로 삭제되었습니다.',
              timer: 3000,
              showConfirmButton: true,
              confirmButtonText: '확인',
              showCancelButton: false,
              timerProgressBar: true,
            });
            setScheduleItems(prevItems =>
              prevItems.filter(prevItem => prevItem.scheduleId !== item.scheduleId),
            );
            setIsEditMode(false);
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    return (
      <td
        key={`${dayOfWeek}-${startTime}`}
        rowSpan={rowSpan}
        style={style}
        onClick={async () => await handleItemClick(item)}
      >
        {subject}
      </td>
    );
  };
  const openEditModal = (item: ScheduleItem) => {
    setSelectedScheduleId(item.scheduleId);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const renderEmptyCell = (dayOfWeek: string, time: number) => {
    const isItemStartingBefore = scheduleItems.some(
      item => item.dayOfWeek === dayOfWeek && item.startTime < time && item.endTime >= time,
    );

    if (!isItemStartingBefore) {
      return (
        <td key={`${dayOfWeek}-${time}`} style={{ height: '100%', cursor: 'default' }}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </td>
      );
    }

    return null;
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedScheduleId(null);
    setIsEditMode(false);
  };

  const handleModalSubmit = async (
    dayOfWeek: string,
    startTime: number,
    endTime: number,
    color: string,
    subject: string,
    scheduleId: number,
  ) => {
    const newItem = { dayOfWeek, startTime, endTime };
    const isOverlapping = scheduleItems.some(item => {
      if (isEditMode && selectedScheduleId === item.scheduleId) {
        return false;
      }
      const isSameDay = item.dayOfWeek === newItem.dayOfWeek;
      const isOverlap =
        (item.startTime <= newItem.startTime && item.endTime >= newItem.startTime) ||
        (newItem.startTime <= item.startTime && newItem.endTime >= item.startTime);
      return isSameDay && isOverlap;
    });
    if (isOverlapping) {
      alert('중복된 시간표가 있습니다.');
      return;
    }
    if (selectedScheduleId) {
      setScheduleItems(prevItems =>
        prevItems.map(item =>
          item.scheduleId === selectedScheduleId
            ? { dayOfWeek, startTime, endTime, color, subject, scheduleId: selectedScheduleId }
            : item,
        ),
      );
    } else {
      // 새로운 아이템을 추가합니다.
      addScheduleItem(scheduleId, dayOfWeek, startTime, endTime, color, subject);
    }
    setSelectedScheduleId(null);
    setIsModalOpen(false);
    setIsEditMode(false);
  };
  const editItem = selectedScheduleId
    ? scheduleItems.find(item => item.scheduleId === selectedScheduleId)
    : undefined;

  const updateSelectPage = (page: string) => {
    setSelectPage(page);
  };

  return (
    <>
      <MypageNavbar
        userImg={userImg}
        setUserImg={setUserImg}
        selectPage="scheduler"
        updateSelectPage={updateSelectPage}
      />
      <DesktopHeader>
        <div className="mypagescheduler-maincontainer">
          <div className="mypagescheduler-titlecontainer">
            <h2 className="mypagescheduler-mainname">
              <span>SCHOOL</span>
              <span>SCHEDULER</span>
            </h2>
            <div className="mypagescheduler-iconcontainer">
              <img
                onClick={handleAddButtonClick}
                className="mypagescheduler-plusicon"
                src={MypagePlus}
              ></img>
            </div>
          </div>
          <div className="mypagescheduler-schedule-container">
            <table className="mypagescheduler-schedule-table">
              <thead>
                <tr>
                  <th></th>
                  <th>월요일</th>
                  <th>화요일</th>
                  <th>수요일</th>
                  <th>목요일</th>
                  <th>금요일</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(15)].map((_, i) => (
                  <tr key={`row-${i}`}>
                    <td className="mypagescheduler-time-cell">{i + 1}</td>
                    {[...Array(5)].map((_, j) => {
                      const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][j];
                      const item = scheduleItems.find(
                        item => item.dayOfWeek === dayOfWeek && item.startTime === i + 1,
                      );

                      if (item) {
                        return renderScheduleItem(
                          item.scheduleId,
                          item.dayOfWeek,
                          item.startTime,
                          item.endTime,
                          item.color,
                          item.subject,
                        );
                      } else {
                        return renderEmptyCell(dayOfWeek, i + 1);
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {isModalOpen && (
              <div className="mypagescheduler-modal-container">
                <div className="mypagescheduler-modal-content">
                  <div className="mypagescheduler-modal-body">
                    <AddScheduleModal
                      onSubmit={handleModalSubmit}
                      onCancel={handleModalClose}
                      existingItems={scheduleItems}
                      editItem={editItem}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div className="tablet-mypagescheduler-maincontainer">
          <div className="tablet-mypagescheduler-titlecontainer">
            <h2 className="tablet-mypagescheduler-mainname">
              <span>SCHOOL</span>
              <span>SCHEDULER</span>
            </h2>
            <div className="tablet-mypagescheduler-iconcontainer">
              <img
                onClick={handleAddButtonClick}
                className="tablet-mypagescheduler-plusicon"
                src={MypagePlus}
              ></img>
            </div>
          </div>
          <div className="tablet-mypagescheduler-schedule-container">
            <table className="tablet-mypagescheduler-schedule-table">
              <thead>
                <tr>
                  <th></th>
                  <th>월요일</th>
                  <th>화요일</th>
                  <th>수요일</th>
                  <th>목요일</th>
                  <th>금요일</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(15)].map((_, i) => (
                  <tr key={`row-${i}`}>
                    <td className="tablet-mypagescheduler-time-cell">{i + 1}</td>
                    {[...Array(5)].map((_, j) => {
                      const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][j];
                      const item = scheduleItems.find(
                        item => item.dayOfWeek === dayOfWeek && item.startTime === i + 1,
                      );

                      if (item) {
                        return renderScheduleItem(
                          item.scheduleId,
                          item.dayOfWeek,
                          item.startTime,
                          item.endTime,
                          item.color,
                          item.subject,
                        );
                      } else {
                        return renderEmptyCell(dayOfWeek, i + 1);
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {isModalOpen && (
              <div className="tablet-mypagescheduler-modal-container">
                <div className="tablet-mypagescheduler-modal-content">
                  <div className="tablet-mypagescheduler-modal-body">
                    <AddScheduleModal
                      onSubmit={handleModalSubmit}
                      onCancel={handleModalClose}
                      existingItems={scheduleItems}
                      editItem={editItem}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MobileHeader>
      <Mobile>
        <div className="mobile-mypagescheduler-maincontainer">
          <div className="mobile-mypagescheduler-titlecontainer">
            <h2 className="mobile-mypagescheduler-mainname">SCHOOL SCHEDULER</h2>
            <div className="mobile-mypagescheduler-iconcontainer">
              <img
                onClick={handleAddButtonClick}
                className="mobile-mypagescheduler-plusicon"
                src={MypagePlus}
              ></img>
            </div>
          </div>
          <div className="mobile-mypagescheduler-schedule-container">
            <table className="mobile-mypagescheduler-schedule-table">
              <thead>
                <tr>
                  <th></th>
                  <th>월요일</th>
                  <th>화요일</th>
                  <th>수요일</th>
                  <th>목요일</th>
                  <th>금요일</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(15)].map((_, i) => (
                  <tr key={`row-${i}`}>
                    <td className="mobile-mypagescheduler-time-cell">{i + 1}</td>
                    {[...Array(5)].map((_, j) => {
                      const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][j];
                      const item = scheduleItems.find(
                        item => item.dayOfWeek === dayOfWeek && item.startTime === i + 1,
                      );

                      if (item) {
                        return renderScheduleItem(
                          item.scheduleId,
                          item.dayOfWeek,
                          item.startTime,
                          item.endTime,
                          item.color,
                          item.subject,
                        );
                      } else {
                        return renderEmptyCell(dayOfWeek, i + 1);
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {isModalOpen && (
              <div className="mobile-mypagescheduler-modal-container">
                <div className="mobile-mypagescheduler-modal-content">
                  <div className="mobile-mypagescheduler-modal-body">
                    <AddScheduleModal
                      onSubmit={handleModalSubmit}
                      onCancel={handleModalClose}
                      existingItems={scheduleItems}
                      editItem={editItem}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default MypageScheduler;
