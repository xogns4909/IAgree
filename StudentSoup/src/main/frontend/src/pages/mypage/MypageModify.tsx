import React, { useState } from 'react';
import { DesktopHeader, MobileHeader, Mobile } from '../../mediaQuery';
import Swal from 'sweetalert2';
import './mypageModify.scss';
import { type UserInfoType } from './interfaces/MypageInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import SchoolAndMajorModal from './components/SchoolAndMajorModal';
import { editUserNickname } from 'apis/api/UserAPI';
interface propTypes {
  memberId: number;
  schoolId: number;
  departmentId: number;
  id: string;
  nickname: string;
  email: string;
  departmentName: string;
  schoolName: string;
  onNicknameChange: (newNickname: string) => void;
  onSchoolAndMajorChange: (school: string, major: string, email: string) => void;
  onUpdateUserInfo: (updatedUserInfo: Partial<UserInfoType>) => void;
}

const MypageModify = (props: propTypes) => {
  const [editNickName, setEditNickName] = useState<string>(props.nickname);
  const [showModal, isShowModal] = useState(false);
  const [propsmajorName, setPropsMajorName] = useState<string>(props.departmentName);
  const [propsSchoolName, setPropsSchoolName] = useState<string>(props.schoolName);
  const [propsEmail, setPropsEmail] = useState<string>(props.email);
  const handleSchoolAndMajorEdit = (
    newSchoolId: number,
    newMajorId: number,
    school: string,
    major: string,
    email: string,
  ) => {
    setPropsSchoolName(school);
    setPropsMajorName(major);
    setPropsEmail(email);
    isShowModal(false);
    props.onSchoolAndMajorChange(school, major, email);
    props.onUpdateUserInfo({
      schoolId: newSchoolId,
      departmentId: newMajorId,
      schoolName: school,
      departmentName: major,
      email,
    });
  };
  const handleNicknameEdit = async () => {
    const { value: newNickname } = await Swal.fire({
      title: '닉네임 수정',
      input: 'text',
      inputLabel: '새로운 닉네임을 입력하세요',
      inputPlaceholder: '새로운 닉네임',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
      inputValidator: (value: string) => {
        if (!value) {
          return '닉네임을 입력해주세요';
        }
        if (value.length > 12) {
          return '닉네임의 최대 길이는 12글자입니다';
        }
        return null;
      },
    });

    if (newNickname && props?.memberId && props?.schoolId && props?.departmentId) {
      editUserNickname(
        props.memberId,
        props.schoolId,
        props.departmentId,
        props.id,
        newNickname,
        props.email,
      )
        .then(() => {
          setEditNickName(newNickname);
          props.onNicknameChange(newNickname);
          Swal.fire({
            icon: 'success',
            title: '닉네임 수정 완료',
            text: '닉네임이 성공적으로 수정되었습니다.',
            timer: 3000,
            showConfirmButton: true,
            confirmButtonText: '확인',
            showCancelButton: false,
            timerProgressBar: true,
          });
          props.onUpdateUserInfo({
            nickname: newNickname,
          });
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: '오류 발생',
            text: err.response.data.message,
          }).then(() => {
            handleNicknameEdit();
          });
        });
    }
  };

  const updatePasswordCriteriaColors = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 20;

    const lowerUpperColor = hasLowercase && hasUppercase ? '#ff611d' : '#b4b4b4';
    const numberColor = hasNumber ? '#ff611d' : '#b4b4b4';
    const lengthColor = isValidLength ? '#ff611d' : '#b4b4b4';

    (Swal.getPopup()?.querySelector('#lower-upper') as HTMLElement).style.color = lowerUpperColor;
    (Swal.getPopup()?.querySelector('#number') as HTMLElement).style.color = numberColor;
    (Swal.getPopup()?.querySelector('#length') as HTMLElement).style.color = lengthColor;
  };
  const handlePasswordEdit = async () => {
    const result = await Swal.fire({
      title: '비밀번호 수정',
      html:
        '<form>' +
        '<div style="display: flex; flex-direction: row; align-items: center; font-size:1rem">' +
        '<label for="username" style="width: 30%;">아이디:</label>' +
        '<input id="username" type="text" class="swal2-input" value="' +
        props.id +
        '" style="width: 70%;" readonly autocomplete="username">' +
        '</div>' +
        '<div style="display: flex; flex-direction: row; align-items: center; font-size:1rem">' +
        '<label for="password" style="width: 30%;">비밀번호:</label>' +
        '<input id="password" type="password" class="swal2-input" placeholder="새로운 비밀번호" style="width: 70%;" autocomplete="new-password">' +
        '</div>' +
        '<small id="lower-upper" style="color: #b4b4b4; margin-left: 2.2rem;">대소문자</small>' +
        '<small id="number" style="color: #b4b4b4; margin-left: 1rem;">숫자</small>' +
        '<small id="length" style="color: #b4b4b4; margin-left: 1rem;">8~20자 이내</small>' +
        '<div style="display: flex; flex-direction: row; align-items: center; font-size:1rem">' +
        '<label for="password-confirm" style="width: 30%;">비밀번호 확인:</label>' +
        '<input id="password-confirm" type="password" class="swal2-input" placeholder="새 비밀번호 확인" style="width: 70%;" autocomplete="new-password">' +
        '</div>' +
        '</form>',
      preConfirm: (): any => {
        const password = (Swal.getPopup()?.querySelector('#password') as HTMLInputElement)?.value;
        const passwordConfirm = (
          Swal.getPopup()?.querySelector('#password-confirm') as HTMLInputElement
        )?.value;

        if (!password) {
          Swal.showValidationMessage('비밀번호를 입력해주세요');
          return false;
        }

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/.test(password)) {
          Swal.showValidationMessage(
            '비밀번호는 대소문자 1개 이상, 숫자를 포함하여 8~20글자 이내로 입력해주세요.',
          );
          return false;
        }

        if (password !== passwordConfirm) {
          Swal.showValidationMessage('비밀번호가 일치하지 않습니다.');
          return false;
        }

        return { password, passwordConfirm };
      },
      confirmButtonText: '수정',
      cancelButtonText: '취소',
      showCancelButton: true,
      didOpen: () => {
        const passwordInput = Swal.getPopup()?.querySelector('#password') as HTMLInputElement;
        const passwordConfirmInput = Swal.getPopup()?.querySelector(
          '#password-confirm',
        ) as HTMLInputElement;
        const form = Swal.getPopup()?.querySelector('form');

        if (form) {
          form.addEventListener('submit', event => {
            event.preventDefault();
            Swal.clickConfirm();
          });
        }

        passwordInput.focus();

        passwordInput.addEventListener('input', (event: Event) => {
          const target = event.target as HTMLInputElement;
          updatePasswordCriteriaColors(target.value);
        });

        passwordInput.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            Swal.clickConfirm();
          }
        });

        passwordConfirmInput.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
      },
    });

    if (result.isConfirmed) {
      const { password, passwordConfirm } = result.value as {
        password: string;
        passwordConfirm: string;
      };
      if (editNickName && props?.memberId && props?.schoolId && props?.departmentId) {
        editUserNickname(
          props.memberId,
          props.schoolId,
          props.departmentId,
          props.id,
          editNickName,
          props.email,
          password,
        )
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '비밀번호 수정 완료',
              text: '비밀번호가 성공적으로 수정되었습니다.',
              timer: 3000,
              showConfirmButton: true,
              confirmButtonText: '확인',
              showCancelButton: false,
              timerProgressBar: true,
            });
          })
          .catch((err: any) => {
            console.error(err);
          });
      }
    }
  };

  return (
    <>
      <DesktopHeader>
        <div className="mypagemodify-container">
          <div className="mypagemodify-boardmain">
            <h2 className="mypagemodify-boardmainname">프로필 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mypagemodify-editicon"
              onClick={handleNicknameEdit}
            />
          </div>
          <table className="mypagemodify-boardtable">
            <thead>
              <tr>
                <td>닉네임</td>
                <th>{editNickName}</th>
              </tr>
            </thead>
          </table>
          <div className="mypagemodify-boardmain">
            <h2 className="mypagemodify-boardmainname">계정 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mypagemodify-editicon"
              onClick={handlePasswordEdit}
            />
          </div>
          <table className="mypagemodify-boardtable">
            <thead>
              <tr>
                <td>아이디</td>
                <th>{props.id}</th>
              </tr>
              <tr>
                <td>비밀번호</td>
                <th></th>
              </tr>
            </thead>
          </table>
          <div className="mypagemodify-boardmain">
            <h2 className="mypagemodify-boardmainname">학교 및 전공</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mypagemodify-editicon"
              onClick={() => isShowModal(true)}
            />
          </div>
          <table className="mypagemodify-boardtable">
            <thead>
              <tr>
                <td>학교</td>
                <th>{propsSchoolName}</th>
              </tr>
              <tr>
                <td>전공</td>
                <th>{propsmajorName}</th>
              </tr>
              <tr>
                <td>이메일</td>
                <th>{propsEmail}</th>
              </tr>
            </thead>
          </table>
          <SchoolAndMajorModal
            show={showModal}
            onClose={() => isShowModal(false)}
            onSubmit={handleSchoolAndMajorEdit}
            memberId={props.memberId}
            schoolId={props.schoolId}
            departmentId={props.departmentId}
            id={props.id}
            nickname={props.nickname}
            email={props.email}
            departmentName={props.departmentName}
            schoolName={props.schoolName}
          />
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div className="tablet-mypagemodify-container">
          <div className="tablet-mypagemodify-boardmain">
            <h2 className="tablet-mypagemodify-boardmainname">프로필 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="tablet-mypagemodify-editicon"
              onClick={handleNicknameEdit}
            />
          </div>
          <table className="tablet-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>닉네임</td>
                <th>{editNickName}</th>
              </tr>
            </thead>
          </table>
          <div className="tablet-mypagemodify-boardmain">
            <h2 className="tablet-mypagemodify-boardmainname">계정 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="tablet-mypagemodify-editicon"
              onClick={handlePasswordEdit}
            />
          </div>
          <table className="tablet-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>아이디</td>
                <th>{props.id}</th>
              </tr>
              <tr>
                <td>비밀번호</td>
                <th></th>
              </tr>
            </thead>
          </table>
          <div className="tablet-mypagemodify-boardmain">
            <h2 className="tablet-mypagemodify-boardmainname">학교 및 전공</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="tablet-mypagemodify-editicon"
              onClick={() => isShowModal(true)}
            />
          </div>
          <table className="tablet-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>학교</td>
                <th>{propsSchoolName}</th>
              </tr>
              <tr>
                <td>전공</td>
                <th>{propsmajorName}</th>
              </tr>
              <tr>
                <td>이메일</td>
                <th>{propsEmail}</th>
              </tr>
            </thead>
          </table>
          <SchoolAndMajorModal
            show={showModal}
            onClose={() => isShowModal(false)}
            onSubmit={handleSchoolAndMajorEdit}
            memberId={props.memberId}
            schoolId={props.schoolId}
            departmentId={props.departmentId}
            id={props.id}
            nickname={props.nickname}
            email={props.email}
            departmentName={props.departmentName}
            schoolName={props.schoolName}
          />
        </div>
      </MobileHeader>
      <Mobile>
        <div className="mobile-mypagemodify-container">
          <div className="mobile-mypagemodify-boardmain">
            <h2 className="mobile-mypagemodify-boardmainname">프로필 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mobile-mypagemodify-editicon"
              onClick={handleNicknameEdit}
            />
          </div>
          <table className="mobile-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>닉네임</td>
                <th>{editNickName}</th>
              </tr>
            </thead>
          </table>
          <div className="mobile-mypagemodify-boardmain">
            <h2 className="mobile-mypagemodify-boardmainname">계정 정보</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mobile-mypagemodify-editicon"
              onClick={handlePasswordEdit}
            />
          </div>
          <table className="mobile-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>아이디</td>
                <th>{props.id}</th>
              </tr>
              <tr>
                <td>비밀번호</td>
                <th></th>
              </tr>
            </thead>
          </table>
          <div className="mobile-mypagemodify-boardmain">
            <h2 className="mobile-mypagemodify-boardmainname">학교 및 전공</h2>
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              className="mobile-mypagemodify-editicon"
              onClick={() => isShowModal(true)}
            />
          </div>
          <table className="mobile-mypagemodify-boardtable">
            <thead>
              <tr>
                <td>학교</td>
                <th>{propsSchoolName}</th>
              </tr>
              <tr>
                <td>전공</td>
                <th>{propsmajorName}</th>
              </tr>
              <tr>
                <td>이메일</td>
                <th>{propsEmail}</th>
              </tr>
            </thead>
          </table>
          <SchoolAndMajorModal
            show={showModal}
            onClose={() => isShowModal(false)}
            onSubmit={handleSchoolAndMajorEdit}
            memberId={props.memberId}
            schoolId={props.schoolId}
            departmentId={props.departmentId}
            id={props.id}
            nickname={props.nickname}
            email={props.email}
            departmentName={props.departmentName}
            schoolName={props.schoolName}
          />
        </div>
      </Mobile>
    </>
  );
};

export default MypageModify;
