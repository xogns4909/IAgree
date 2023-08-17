// AdminAddSchool.tsx
import React, { useEffect, useState } from 'react';
import './adminaddschool.scss';
interface SchoolType {
  schoolId: number;
  schoolName: string;
  schoolCoordinate: string;
  schoolEmail: string;
}
interface AdminAddSchoolProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (school: { name: string; coordinate: string; email: string }) => void;
  isEditMode?: boolean;
  selectedSchool?: SchoolType | null;
}

const AdminAddSchool: React.FC<AdminAddSchoolProps> = ({
  isOpen,
  onClose,
  onSave,
  isEditMode,
  selectedSchool,
}) => {
  const [name, setName] = useState('');
  const [coordinate, setCoordinate] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (isEditMode && selectedSchool) {
      setName(selectedSchool.schoolName);
      setCoordinate(selectedSchool.schoolCoordinate);
      setEmail(selectedSchool.schoolEmail);
    }
  }, [isEditMode, selectedSchool]);
  const handleSave = () => {
    onSave({ name, coordinate, email });
    // 초기화
    setName('');
    setCoordinate('');
    setEmail('');
  };
  const handleClose = () => {
    // 입력값 초기화
    setName('');
    setCoordinate('');
    setEmail('');

    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="adminaddschool-modal">
      <div className="adminaddschool-content">
        <h3>학교 추가</h3>
        <label>학교 명:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <label>학교 위치 (좌표):</label>
        <input type="text" value={coordinate} onChange={e => setCoordinate(e.target.value)} />
        <label>학교 이메일:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <div className="adminaddschool-buttons">
          <button onClick={handleSave}>저장</button>
          <button onClick={handleClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddSchool;
