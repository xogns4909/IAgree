import React, { useEffect, useState } from 'react';
import './schoolAndMajorModal.scss';
import Swal from 'sweetalert2';
import { authenticateEmail, checkEmailAuthentication } from 'apis/auth/AuthAPI';
import { editUserNickname, getDepartment, getSchoolList } from 'apis/api/UserAPI';

interface SchoolAndMajorModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (
    newSchoolId: number,
    newMajorId: number,
    school: string,
    major: string,
    email: string,
  ) => void;
  memberId: number;
  schoolId: number;
  departmentId: number;
  id: string;
  nickname: string;
  email: string;
  departmentName: string;
  schoolName: string;
}
interface School {
  schoolId: number;
  schoolName: string;
}

interface Major {
  departmentId: number;
  departmentName: string;
}
const SchoolAndMajorModal: React.FC<SchoolAndMajorModalProps> = ({
  show,
  onClose,
  onSubmit,
  memberId,
  schoolId,
  departmentId,
  id,
  nickname,
  email,
  departmentName,
  schoolName,
}) => {
  if (!show) {
    return null;
  }
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [emailDomain, setEmailDomain] = useState<string>(email.split('@')[1]);
  const [emailPrefix, setEmailPrefix] = useState<string>(email.split('@')[0]);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showVerificationInput, setShowVerificationInput] = useState<boolean>(false);
  const [selectSchoolId, setSelectSchoolId] = useState<number>(schoolId);
  const [selectedMajorId, setSelectedMajorId] = useState<number>(departmentId);
  const [verificationStarted, setVerificationStarted] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<
    'none' | 'pending' | 'success' | 'error'
  >('none');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  useEffect(() => {
    getSchoolList().then(res => {
      setSchools(res.data);
    });

    getDepartment(selectSchoolId).then(res => {
      setMajors(res.data.departments);
    });
  }, []);

  const handleSchoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSchoolId = parseInt(event.target.value);
    setSelectSchoolId(selectedSchoolId);
    getDepartment(selectedSchoolId).then(res => {
      setMajors(res.data.departments);
      setEmailDomain(res.data.domain);

      if (res.data.departments.length > 0) {
        setSelectedMajorId(res.data.departments[0].departmentId);
      } else {
        setSelectedMajorId(-1);
      }
    });
  };
  const handleMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMajorId(parseInt(event.target.value));
  };
  const handleVerifyButtonClick = () => {
    setSendingEmail(true);
    setVerificationStarted(true);
    authenticateEmail(emailPrefix, emailDomain)
      .then(() => {
        setSendingEmail(false);
        setShowVerificationInput(true);
        setShowVerificationMessage(true);
      })
      .catch(err => {
        console.error(err);
        setSendingEmail(false);
        setVerificationStarted(false);
      });
  };

  const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };

  const handleVerification = () => {
    checkEmailAuthentication(`${emailPrefix}@${emailDomain}`, parseInt(verificationCode))
      .then(() => {
        setVerificationStatus('success');
        setVerificationMessage('인증이 완료되었습니다.');
      })
      .catch(() => {
        setVerificationStatus('error');
        setVerificationMessage('인증 코드 오류');
      });
  };
  const handleEditButtonClick = () => {
    editUserNickname(
      memberId,
      selectSchoolId,
      selectedMajorId,
      id,
      nickname,
      `${emailPrefix}@${emailDomain}`,
    )
      .then(() => {
        onSubmit(
          selectSchoolId,
          selectedMajorId,
          schools.find(school => school.schoolId === selectSchoolId)?.schoolName ?? '',
          majors.find(major => major.departmentId === selectedMajorId)?.departmentName ?? '',
          `${emailPrefix}@${emailDomain}`,
        );
        onClose();
        Swal.fire({
          icon: 'success',
          title: '정보수정 완료',
          text: '내정보가 성공적으로 수정되었습니다.',
          timer: 3000,
          showConfirmButton: true,
          confirmButtonText: '확인',
          showCancelButton: false,
          timerProgressBar: true,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
  return (
    <div className={`modalContainer ${show ? 'active' : ''}`}>
      <div className="modalOverlay"></div>
      <div className="modal">
        <div className="modal-header">
          <h2>학교 및 전공 수정</h2>
        </div>
        <div className="modal-body">
          <div className="modal-contents">
            <label htmlFor="school" className="modal-labelname">
              학교:
            </label>
            <select
              className="modal-selectbar"
              id="school"
              value={selectSchoolId}
              onChange={handleSchoolChange}
              disabled={showVerificationInput}
            >
              {schools.map(school => (
                <option key={school.schoolId} value={school.schoolId}>
                  {school.schoolName}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-contents">
            <label htmlFor="major" className="modal-labelname">
              전공:
            </label>
            <select
              className="modal-selectbar"
              id="major"
              value={selectedMajorId}
              onChange={handleMajorChange}
              disabled={showVerificationInput}
            >
              {majors.map(major => (
                <option key={major.departmentId} value={major.departmentId}>
                  {major.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-contents">
            <label className="modal-labelname" htmlFor="email">
              이메일:
            </label>
            <input
              className="modal-inputtext"
              id="email-prefix"
              type="text"
              value={emailPrefix}
              onChange={e => setEmailPrefix(e.target.value)}
              disabled={showVerificationInput}
            />
            <input
              className="modal-emaildomain"
              id="email-domain"
              type="text"
              value={`@${emailDomain}`}
              disabled
            />
            <button
              className={`modal-verifybutton ${
                verificationStarted ||
                (schoolId === selectSchoolId && email.split('@')[0] === emailPrefix)
                  ? 'disabled'
                  : ''
              }`}
              onClick={handleVerifyButtonClick}
              disabled={
                verificationStarted ||
                (schoolId === selectSchoolId && email.split('@')[0] === emailPrefix)
              }
            >
              인증하기
            </button>
          </div>
          {showVerificationMessage && (
            <p className="modal-verificationmessage">이메일 인증 번호가 전송되었습니다.</p>
          )}
          {sendingEmail && (
            <div className="modal-email-sending-message">
              이메일 인증 코드를 보내는 중입니다. 잠시만 기다려 주세요...
            </div>
          )}
          {showVerificationInput && (
            <div className="modal-contents">
              <label className="modal-labelname" htmlFor="verification-code">
                인증 코드:
              </label>
              <input
                className="modal-inputtext"
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                disabled={verificationStatus === 'success'}
              />
              <button
                className="modal-verifybutton"
                onClick={handleVerification}
                disabled={verificationStatus === 'success'}
              >
                인증
              </button>
            </div>
          )}
          {verificationMessage && (
            <div
              className="verification-message"
              style={{
                color: verificationStatus === 'error' ? '#ff611d' : 'green',
              }}
            >
              {verificationMessage}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            className={`modal-footer-editbutton ${
              !(schoolId !== selectSchoolId && verificationStatus === 'success') &&
              !(
                schoolId === selectSchoolId &&
                departmentId !== selectedMajorId &&
                email.split('@')[0] === emailPrefix
              ) &&
              !(verificationStatus === 'success')
                ? 'disabled'
                : ''
            }`}
            onClick={handleEditButtonClick}
            disabled={
              !(schoolId !== selectSchoolId && verificationStatus === 'success') &&
              !(
                schoolId === selectSchoolId &&
                departmentId !== selectedMajorId &&
                email.split('@')[0] === emailPrefix
              ) &&
              !(verificationStatus === 'success')
            }
          >
            수정
          </button>
          <button className="modal-footer-closebutton" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolAndMajorModal;
