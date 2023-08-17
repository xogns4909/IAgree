import React, { useEffect, useState } from 'react';
import './adminschoollistview.scss';
import AdminNavbar from './AdminNavbar';
import AdminAddSchool from './AdminAddSchool';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import Swal from 'sweetalert2';
interface SchoolType {
  schoolId: number;
  schoolName: string;
  schoolCoordinate: string;
  schoolEmail: string;
}
const AdminSchoolListView = () => {
  const [schools, setSchools] = useState<SchoolType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const handleEditClick = (school: SchoolType) => {
    setIsEditMode(true);
    setSelectedSchool(school);
    setIsModalOpen(true);
  };
  const CallSchoolList = async () => {
    await axiosInstance
      .get('/admin/schools')
      .then(res => {
        setSchools(res.data.schools);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    CallSchoolList();
  }, []);
  const handleAddOrEditSchool = async (school: {
    name: string;
    coordinate: string;
    email: string;
  }) => {
    const requestBody = {
      schoolName: school.name,
      schoolCoordinate: school.coordinate,
      schoolEmail: school.email,
    };

    if (isEditMode) {
      // 수정 모드
      axiosInstance
        .post('/admin/school/edit', requestBody, { params: { schoolId: selectedSchool?.schoolId } })
        .then(() => {
          Swal.fire({
            title: '성공',
            text: '학교 정보가 성공적으로 수정되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          }).then(() => {
            // 학교 목록 새로고침
            CallSchoolList();

            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedSchool(null);
          });
        })
        .catch(error => {
          console.error(error);
          Swal.fire({
            title: '오류',
            text: '학교 수정에 실패했습니다. 다시 시도해 주세요.',
            icon: 'error',
            confirmButtonText: '확인',
          });
        });
    } else {
      // 등록 모드
      axiosInstance
        .post('/admin/school', requestBody)
        .then(() => {
          Swal.fire({
            title: '성공',
            text: '학교가 성공적으로 등록되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          }).then(() => {
            // 학교 목록 새로고침
            CallSchoolList();

            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedSchool(null);
          });
        })
        .catch(error => {
          console.error(error);
          Swal.fire({
            title: '오류',
            text: '학교 등록에 실패했습니다. 다시 시도해 주세요.',
            icon: 'error',
            confirmButtonText: '확인',
          });
        });
    }
  };
  const handleDeleteClick = (schoolId: number, schoolName: string) => {
    Swal.fire({
      title: `${schoolName}`,
      text: '선택한 학교를 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '네, 삭제합니다!',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        axiosInstance
          .get('/admin/school/delete', { params: { schoolId } })
          .then(() => {
            Swal.fire({
              title: '성공',
              text: '학교가 성공적으로 삭제되었습니다.',
              icon: 'success',
              confirmButtonText: '확인',
            }).then(() => {
              // 학교 목록 새로고침
              CallSchoolList();
            });
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              title: '오류',
              text: '학교 삭제에 실패했습니다. 다시 시도해 주세요.',
              icon: 'error',
              confirmButtonText: '확인',
            });
          });
      }
    });
  };
  return (
    <div className="adminpage-maincontainer">
      <AdminNavbar />
      <h2>학교 목록</h2>
      <div className="adminschoolview-add-button-container">
        <button onClick={() => setIsModalOpen(true)} className="adminschoolview-add-button">
          학교 추가
        </button>
      </div>
      <table className="adminschoolview-table">
        <thead>
          <tr>
            <th>학교 명</th>
            <th>학교 위치 (좌표)</th>
            <th>학교 이메일</th>
            <th>세부 기능</th>
          </tr>
        </thead>
        <tbody>
          {schools?.map(school => (
            <tr key={school.schoolId}>
              <td>{school.schoolName}</td>
              <td>{school.schoolCoordinate}</td>
              <td>{school.schoolEmail}</td>
              <td>
                <button
                  onClick={() => handleEditClick(school)}
                  className="adminschoolview-button adminschoolview-edit-button"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteClick(school.schoolId, school.schoolName)}
                  className="adminschoolview-button adminschoolview-delete-button"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminAddSchool
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedSchool(null);
        }}
        onSave={handleAddOrEditSchool}
        isEditMode={isEditMode}
        selectedSchool={selectedSchool}
      />
    </div>
  );
};

export default AdminSchoolListView;
