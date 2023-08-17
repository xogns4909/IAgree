import React, { useEffect, useState } from 'react';
import './admindepartmentlistview.scss';
import AdminNavbar from './AdminNavbar';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import Swal from 'sweetalert2';
interface SchoolType {
  schoolId: number;
  schoolName: string;
  schoolCoordinate: string;
  schoolEmail: string;
}
interface DepartmentType {
  departmentId: number;
  departmentName: string;
}
const AdminDepartmentListView = () => {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [searchedSchoolId, setSearchedSchoolId] = useState<string | null>(null);
  const [searchedSchoolName, setSearchedSchoolName] = useState('');
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  useEffect(() => {
    axiosInstance
      .get('/admin/department')
      .then(res => {
        console.log(res.data);
        setSchools(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  const handleSearch = () => {
    if (selectedSchoolId) {
      // 선택한 학교의 이름을 찾기
      const selectedSchool = schools.find(school => school.schoolId === Number(selectedSchoolId));
      if (selectedSchool) {
        setSearchedSchoolName(selectedSchool.schoolName);
        setSearchedSchoolId(selectedSchoolId); // 검색된 학교 ID 업데이트
      }

      // 학과 정보 가져오기
      axiosInstance
        .get('/admin/departments', { params: { schoolId: selectedSchoolId } })
        .then(res => {
          setDepartments(res.data.departments);
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      alert('학교를 선택해주세요.');
    }
  };
  const handleAddDepartment = () => {
    Swal.fire({
      title: '학과 추가',
      text: '추가할 학과 이름을 입력하세요.',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: '추가',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const departmentName = result.value;

        axiosInstance
          .post('/admin/department', {
            schoolId: Number(searchedSchoolId),
            departmentName,
          })
          .then(() => {
            Swal.fire({
              title: '성공',
              text: '학과가 성공적으로 추가되었습니다.',
              icon: 'success',
              confirmButtonText: '확인',
            });
            // 학과 목록 새로고침
            handleSearch();
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              title: '오류',
              text: '학과 추가에 실패했습니다. 다시 시도해 주세요.',
              icon: 'error',
              confirmButtonText: '확인',
            });
          });
      }
    });
  };
  const handleEditDepartment = (departmentId: number, departmentName: string) => {
    Swal.fire({
      title: '학과 수정',
      text: '수정할 학과 이름을 입력하세요.',
      input: 'text',
      inputValue: departmentName || '',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const updatedDepartmentName = result.value;

        axiosInstance
          .post(`/admin/department/edit/${departmentId}`, {
            schoolId: Number(searchedSchoolId),
            departmentName: updatedDepartmentName,
          })
          .then(() => {
            Swal.fire({
              title: '성공',
              text: '학과가 성공적으로 수정되었습니다.',
              icon: 'success',
              confirmButtonText: '확인',
            });

            // 학과 목록 새로고침
            handleSearch();
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              title: '오류',
              text: '학과 수정에 실패했습니다. 다시 시도해 주세요.',
              icon: 'error',
              confirmButtonText: '확인',
            });
          });
      }
    });
  };
  const handleDeleteClick = (departmentId: number) => {
    Swal.fire({
      title: '삭제 확인',
      text: '정말로 이 학과를 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        axiosInstance
          .get(`/admin/department/${departmentId}`)
          .then(() => {
            Swal.fire({
              title: '성공',
              text: '학과가 성공적으로 삭제되었습니다.',
              icon: 'success',
              confirmButtonText: '확인',
            });
            // 학과 목록 새로고침
            handleSearch();
          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              title: '오류',
              text: '학과 삭제에 실패했습니다. 다시 시도해 주세요.',
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
      <h2>학과 관리 페이지</h2>
      <div className="admindepartmentlistview-search-container">
        <div className="admindepartmentlistview-select-container">
          <select
            className="admindepartmentlistview-select"
            value={selectedSchoolId}
            onChange={e => setSelectedSchoolId(e.target.value)}
          >
            <option value="">학교 선택</option>
            {schools.map(school => (
              <option key={school.schoolId} value={school.schoolId}>
                {school.schoolName}
              </option>
            ))}
          </select>
          <button className="admindepartmentlistview-search-button" onClick={handleSearch}>
            검색
          </button>
        </div>
        {searchedSchoolId && (
          <button className="admindepartmentlistview-add-button" onClick={handleAddDepartment}>
            {searchedSchoolId}
            {searchedSchoolName}학과 추가
          </button>
        )}
      </div>
      <table className="admindepartmentlistview-table">
        <thead>
          <tr>
            <th>학교명</th>
            <th>학과명</th>
            <th>세부 기능</th>
          </tr>
        </thead>
        <tbody>
          {departments?.map((department, _) => (
            <tr key={department.departmentId}>
              <td>{searchedSchoolName}</td>
              <td>{department.departmentName}</td>
              <td>
                <button
                  className="admindepartmentlistview-button admindepartmentlistview-edit-button"
                  onClick={() =>
                    handleEditDepartment(department.departmentId, department.departmentName)
                  }
                >
                  수정
                </button>
                <button
                  className="admindepartmentlistview-button admindepartmentlistview-delete-button"
                  onClick={() => handleDeleteClick(department.departmentId)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepartmentListView;
