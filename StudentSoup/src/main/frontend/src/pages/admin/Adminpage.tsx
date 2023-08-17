import React, { useEffect, useState } from 'react';
import './adminpage.scss';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import AdminNavbar from './AdminNavbar';

interface MemberType {
  departmentId: number;
  departmentName: string;
  email: string;
  fileName: string | null;
  id: string;
  memberClassification: string;
  memberId: number;
  nickname: string;
  registrationDate: string;
  schoolId: number;
  schoolName: string;
}

const Adminpage = () => {
  const [members, setMembers] = useState<MemberType[]>([]);

  useEffect(() => {
    axiosInstance
      .get('admin/members', { params: { field: null, value: '' } })
      .then(res => {
        setMembers(res.data.members);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="adminpage-maincontainer">
      <AdminNavbar />
      <table className="adminpage-table">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>학교이름</th>
            <th>학과이름</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.memberId}>
              <td>{member.nickname}</td>
              <td>{member.email}</td>
              <td>{member.registrationDate}</td>
              <td>{member.schoolName}</td>
              <td>{member.departmentName}</td>
              <td>{member.memberClassification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpage;
