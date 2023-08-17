import React, { useEffect, useState } from 'react';
import MypageNavbar from 'components/common/MypageNavbar';
import { DesktopHeader, MobileHeader, Mobile } from 'mediaQuery';
import './mypageMain.scss';
import MemberImg from 'assets/images/circle_human.png';
import MypagePreview from './MypagePreview';
import MypageContents from './MypageContents';
import MypagReview from './MypageReview';
import MypageModify from './MypageModify';
import Swal from 'sweetalert2';
import { ReactComponent as SchoolIcon } from 'assets/images/SchoolIcon.svg';
import { ReactComponent as SchoolSkillIcon } from 'assets/images/SchoolSkillIcon.svg';
import { type UserInfoType } from './interfaces/MypageInterface';
import { editUserProfile, getUserInformation, imageDelete, imageUpload } from 'apis/api/UserAPI';

const MypageMain = () => {
  let year = '';
  let month = '';
  let day = '';
  const [selectPage, setSelectPage] = useState<string>('preview');
  const handleSelectPage = (pagename: string) => {
    setSelectPage(pagename);
  };
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [userImg, setUserImg] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [propsmajorName, setPropsMajorName] = useState<string>('');
  const [propsSchoolName, setPropsSchoolName] = useState<string>('');
  const [propsEmail, setPropsEmail] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const handleEditProfile = async () => {
    const result = await Swal.fire({
      html: `
        <form id="password-form" class="password-form">
          <input type="text" id="username-input" autocomplete="username" style="display:none" />
          <label for="password-input">비밀번호 확인</label>
          <input type="password" id="password-input" placeholder="기존 비밀번호를 입력해주세요" autocomplete="new-password" />
        </form>
      `,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        return passwordInput.value;
      },
      didOpen: () => {
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        passwordInput.focus();
        passwordInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            Swal.clickConfirm();
          }
        });
      },
    });

    if (result.dismiss) {
      return;
    }
    if (userInfo?.memberId && result?.value) {
      editUserProfile(userInfo?.memberId, userInfo?.id, result.value)
        .then(() => {
          setSelectPage('modify');
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: '비밀번호가 일치하지 않습니다.',
            text: '다시 시도해주세요.',
          }).then(() => {
            handleEditProfile();
          });
        });
    }
  };

  useEffect(() => {
    getUserInformation()
      .then(res => {
        setUserInfo(res.data);
        setUserImg(res.data.fileName);
        setNickname(res.data.nickname);
        setPropsEmail(res.data.email);
        setPropsMajorName(res.data.departmentName);
        setPropsSchoolName(res.data.schoolName);
        setMemberId(res.data.memberId);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  if (userInfo?.registrationDate) {
    [year, month, day] = userInfo.registrationDate.split('-');
  }
  const formatDate = `${year}년 ${month}월 ${day}일`;

  const handleImageOptions = async () => {
    const showOptions = async (): Promise<void> => {
      const result = await Swal.fire({
        title: '프로필을 변경하시겠습니까?',
        showDenyButton: true,
        confirmButtonText: '변경',
        denyButtonText: '삭제',
      });

      if (result.isConfirmed) {
        const imageUploadInput = document.getElementById('image-upload');
        if (imageUploadInput) {
          imageUploadInput.click();
        }
        Swal.close();
      } else if (result.isDenied) {
        if (!userImg) {
          await Swal.fire({
            icon: 'error',
            title: '이미 기본프로필 사진입니다.',
          });
          return await showOptions();
        } else {
          const deleteResult = await Swal.fire({
            title: '정말로 삭제하시겠습니까?',
            showDenyButton: true,
            confirmButtonText: '삭제',
            denyButtonText: '취소',
          });
          if (deleteResult.isConfirmed && userInfo?.memberId) {
            imageDelete(userInfo.memberId)
              .then(res => {
                setUserImg(res.data.fileName);
              })
              .catch(err => {
                console.error(err);
              });
            location.reload();
          }
        }
      }
    };
    await showOptions();
  };
  const handleImageUpload = async (e: any) => {
    const [file] = e.target.files;
    if (file && userInfo?.memberId) {
      imageUpload(userInfo.memberId, file)
        .then(res => {
          setUserImg(res.data.fileName);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleSchoolAndMajorChange = (school: string, major: string, email: string) => {
    setPropsMajorName(major);
    setPropsEmail(email);
    setPropsSchoolName(school);
  };
  const updateUserInfo = (updatedUserInfo: Partial<UserInfoType>) => {
    setUserInfo(userInfo => {
      if (!userInfo) return userInfo;

      return { ...userInfo, ...updatedUserInfo };
    });
  };
  const updateSelectPage = (page: string) => {
    setSelectPage(page);
  };
  return (
    <>
      <MypageNavbar
        selectPage={selectPage}
        updateSelectPage={updateSelectPage}
        memberId={memberId}
        userImg={userImg}
        setUserImg={setUserImg}
      />
      <DesktopHeader>
        <div className="mypagemain-container">
          <div className="mypagemain-banner"></div>
          <div className="mypagemain-usercontainer">
            <div className="mypagemain-userinfo">
              <div onClick={handleImageOptions} className="mypagemain-imgbox">
                <img src={userImg ? `/image/${userImg}` : MemberImg} className="mypagemain-img" />
                <div className="hover-text">
                  <div>프로필 수정</div>
                  <input
                    type="file"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="mypagemain-username">{nickname}</div>
              <div className="mypagemain-schoolname">
                <SchoolIcon />
                <span className="mypagemain-schooltext">{propsSchoolName}</span>
              </div>
              <div className="mypagemain-schoolskill">
                <SchoolSkillIcon />
                <span className="mypagemain-schooltext">{propsmajorName}</span>
              </div>
              <button
                onClick={selectPage === 'modify' ? undefined : handleEditProfile}
                className="mypagemain-editprofile"
                disabled={selectPage === 'modify'}
              >
                {selectPage === 'modify' ? '내 정보' : '내 프로필 편집'}
              </button>
              <p className="mypagemain-date">가입일 : {formatDate}</p>
            </div>
            {selectPage === 'preview' && userInfo?.memberId && (
              <MypagePreview handleSelectPage={handleSelectPage} memberId={userInfo.memberId} />
            )}
            {selectPage === 'boardreply' && userInfo?.memberId && <MypageContents {...userInfo} />}
            {selectPage === 'review' && userInfo?.memberId && (
              <MypagReview memberId={userInfo.memberId} />
            )}
            {selectPage === 'modify' && userInfo && (
              <MypageModify
                memberId={userInfo.memberId}
                schoolId={userInfo.schoolId}
                departmentId={userInfo.departmentId}
                id={userInfo.id}
                nickname={userInfo.nickname}
                email={userInfo.email}
                departmentName={userInfo.departmentName}
                schoolName={userInfo.schoolName}
                onNicknameChange={handleNicknameChange}
                onSchoolAndMajorChange={handleSchoolAndMajorChange}
                onUpdateUserInfo={updateUserInfo}
              />
            )}
          </div>
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div className="tablet-mypagemain-container">
          <div className="tablet-mypagemain-banner"></div>
          <div className="tablet-mypagemain-usercontainer">
            <div className="tablet-mypagemain-userinfo">
              <div onClick={handleImageOptions} className="tablet-mypagemain-imgbox">
                <img
                  src={userImg ? `/image/${userImg}` : MemberImg}
                  className="tablet-mypagemain-img"
                />
                <div className="tablet-hover-text">
                  <div>프로필 수정</div>
                  <input
                    type="file"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="tablet-mypagemain-username">{nickname}</div>
              <div className="tablet-mypagemain-schoolname">
                <SchoolIcon />
                <span className="tablet-mypagemain-schooltext">{userInfo?.schoolName}</span>
              </div>
              <div className="tablet-mypagemain-schoolskill">
                <SchoolSkillIcon />
                <span className="tablet-mypagemain-schooltext">{userInfo?.departmentName}</span>
              </div>
              <button
                onClick={selectPage === 'modify' ? undefined : handleEditProfile}
                className="tablet-mypagemain-editprofile"
                disabled={selectPage === 'modify'}
              >
                {selectPage === 'modify' ? '내 정보' : '내 프로필 편집'}
              </button>
              <p className="tablet-mypagemain-date">가입일 : {formatDate}</p>
            </div>
            {selectPage === 'preview' && userInfo?.memberId && (
              <MypagePreview handleSelectPage={handleSelectPage} memberId={userInfo.memberId} />
            )}
            {selectPage === 'boardreply' && userInfo?.memberId && <MypageContents {...userInfo} />}
            {selectPage === 'review' && userInfo?.memberId && (
              <MypagReview memberId={userInfo.memberId} />
            )}
            {selectPage === 'modify' && userInfo && (
              <MypageModify
                memberId={userInfo.memberId}
                schoolId={userInfo.schoolId}
                departmentId={userInfo.departmentId}
                id={userInfo.id}
                nickname={userInfo.nickname}
                email={userInfo.email}
                departmentName={userInfo.departmentName}
                schoolName={userInfo.schoolName}
                onNicknameChange={handleNicknameChange}
                onSchoolAndMajorChange={handleSchoolAndMajorChange}
                onUpdateUserInfo={updateUserInfo}
              />
            )}
          </div>
        </div>
      </MobileHeader>
      <Mobile>
        <div className="mobile-mypagemain-container">
          <div className="mobile-mypagemain-banner"></div>
          <div className="mobile-mypagemain-usercontainer">
            <div className="mobile-mypagemain-userinfo">
              <div onClick={handleImageOptions} className="mobile-mypagemain-imgbox">
                <img
                  src={userImg ? `/image/${userImg}` : MemberImg}
                  className="mobile-mypagemain-img"
                />
                <div className="mobile-hover-text">
                  <div>프로필 수정</div>
                  <input
                    type="file"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="mobile-mypagemain-username">{nickname}</div>
              <div className="mobile-mypagemain-schoolname">
                <SchoolIcon />
                <span className="mobile-mypagemain-schooltext">{userInfo?.schoolName}</span>
              </div>
              <div className="mobile-mypagemain-schoolskill">
                <SchoolSkillIcon />
                <span className="mobile-mypagemain-schooltext">{userInfo?.departmentName}</span>
              </div>
              <button
                onClick={selectPage === 'modify' ? undefined : handleEditProfile}
                className="mobile-mypagemain-editprofile"
                disabled={selectPage === 'modify'}
              >
                {selectPage === 'modify' ? '내 정보' : '내 프로필 편집'}
              </button>
              <p className="mobile-mypagemain-date">가입일 : {formatDate}</p>
            </div>
            {selectPage === 'preview' && userInfo?.memberId && (
              <MypagePreview handleSelectPage={handleSelectPage} memberId={userInfo.memberId} />
            )}
            {selectPage === 'boardreply' && userInfo?.memberId && <MypageContents {...userInfo} />}
            {selectPage === 'review' && userInfo?.memberId && (
              <MypagReview memberId={userInfo.memberId} />
            )}
            {selectPage === 'modify' && userInfo && (
              <MypageModify
                memberId={userInfo.memberId}
                schoolId={userInfo.schoolId}
                departmentId={userInfo.departmentId}
                id={userInfo.id}
                nickname={userInfo.nickname}
                email={userInfo.email}
                departmentName={userInfo.departmentName}
                schoolName={userInfo.schoolName}
                onNicknameChange={handleNicknameChange}
                onSchoolAndMajorChange={handleSchoolAndMajorChange}
                onUpdateUserInfo={updateUserInfo}
              />
            )}
          </div>
        </div>
      </Mobile>
    </>
  );
};
export default MypageMain;
