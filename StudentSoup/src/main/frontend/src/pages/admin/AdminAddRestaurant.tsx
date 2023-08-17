import React, { type FormEvent, useState, useEffect } from 'react';
import './adminaddrestaurant.scss';
import AdminNavbar from './AdminNavbar';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminAddRestaurant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.isEditMode;
  const restaurantId = location.state?.restaurantId;
  console.log(isEditMode);
  console.log(restaurantId);
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [delivery, setDelivery] = useState<string>('');
  const [schoolId, setSchoolId] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [coordinate, setCoordinate] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [images, setImages] = useState<File[] | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<Array<Record<string, number>>>([]);
  const categoryMapping: Record<string, string> = {
    KOREAN: '한식',
    WESTERN: '양식',
    FASTFOOD: '패스트푸드',
    ASIAN: '아시아음식',
    JAPAN: '일식',
    CHINESE: '중식',
    SNACK: '분식',
    CAFE: '카페',
    BUFFET: '뷔페',
    OTHERS: '기타',
  };

  useEffect(() => {
    // 카테고리와 학교 옵션 가져오기
    axiosInstance
      .get('/admin/restaurant')
      .then(res => {
        setCategoryOptions(res.data[0]);
        setSchoolOptions(res.data[1]);
      })
      .catch(err => {
        console.error(err);
      });

    // 수정 모드에서 음식점 정보 가져오기
    if (isEditMode && restaurantId) {
      axiosInstance
        .get(`/admin/restaurant/edit/${restaurantId}`)
        .then(res => {
          // 음식점 정보로 상태 업데이트
          console.log(res.data);
          const restaurantData = res.data[1];
          setName(restaurantData.name);
          setAddress(restaurantData.address);
          setCategory(restaurantData.restaurantCategory);
          setStartTime(restaurantData.startTime);
          setEndTime(restaurantData.endTime);
          setDelivery(restaurantData.isDelivery);
          setSchoolName(restaurantData.schoolName);
          setCoordinate(restaurantData.coordinate);
          const telWithoutHyphen = restaurantData.tel.replace(/-/g, '');
          setTel(telWithoutHyphen);
          setTag(restaurantData.tag);
          setDetail(restaurantData.detail);
          const imageFiles = res.data[1].multipartFileList.map((fileInfo: any) => {
            return new File([fileInfo.data], fileInfo.fileName, { type: fileInfo.contentType });
          });
          setImages(imageFiles);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [isEditMode, restaurantId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const url =
      isEditMode && restaurantId ? `/admin/restaurant/edit/${restaurantId}` : '/admin/restaurant';

    formData.append('name', name);
    formData.append('address', address);
    formData.append('restaurantCategory', category);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('schoolId', schoolId);
    formData.append('coordinate', coordinate);
    formData.append('tel', tel);
    formData.append('tag', tag);
    formData.append('detail', detail);
    formData.append('isDelivery', delivery);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('multipartFileList', images[i]);
      }
    }

    try {
      await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        title: '성공',
        text: '데이터가 성공적으로 전송되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/admin');
        }
      });
    } catch (error) {
      console.error('데이터 전송에 실패했습니다.', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const images: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/')) {
          alert('이미지 파일만 선택할 수 있습니다.');
          e.target.value = '';
          return;
        }
        images.push(files[i]);
      }

      if (images.length > 5) {
        alert('최대 5개의 이미지를 선택할 수 있습니다.');
        e.target.value = '';
        return;
      }

      setImages(images);
    }
  };
  console.log('들어간이미지', images);
  return (
    <div className="adminpage-maincontainer">
      <AdminNavbar />
      <div className="adminrestaurant-container">
        <form onSubmit={handleSubmit} className="adminrestaurant-form">
          <div className="adminrestaurant-form-group">
            <label>레스토랑 이름:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group">
            <label>카테고리:</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">카테고리를 선택해주세요</option>
              {categoryOptions.map((option, index) => (
                <option key={index} value={option}>
                  {categoryMapping[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="adminrestaurant-form-group">
            <label>주소:</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group time-group">
            <label>시작 시간:</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            <label>종료 시간:</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group">
            <label>배달 여부:</label>
            <select value={delivery} onChange={e => setDelivery(e.target.value)}>
              <option value="Y">가능</option>
              <option value="N">불가능</option>
            </select>
          </div>

          <div className="adminrestaurant-form-group">
            {isEditMode && restaurantId ? (
              <div className="adminrestaurant-form-group">
                <label>학교:</label>
                <input type="text" value={schoolName} readOnly />
              </div>
            ) : (
              <div className="adminrestaurant-form-group">
                <label>학교 선택:</label>
                <select value={schoolId} onChange={e => setSchoolId(e.target.value)}>
                  <option value="">학교를 선택해주세요</option>
                  {schoolOptions.map((option, _) => {
                    const [schoolName, schoolId] = Object.entries(option)[0];
                    return (
                      <option key={schoolId} value={schoolId}>
                        {schoolName}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          <div className="adminrestaurant-form-group">
            <label>좌표:</label>
            <input
              placeholder="**.****,**.****"
              type="text"
              value={coordinate}
              onChange={e => setCoordinate(e.target.value)}
            />
          </div>

          <div className="adminrestaurant-form-group">
            <label>전화번호:</label>
            <input type="text" value={tel} onChange={e => setTel(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group">
            <label>태그:</label>
            <input type="text" value={tag} onChange={e => setTag(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group">
            <label>세부 사항:</label>
            <textarea value={detail} onChange={e => setDetail(e.target.value)} />
          </div>

          <div className="adminrestaurant-form-group">
            <label>이미지:</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <ul className="adminrestaurant-file-list">
              {images?.map((image, index) => (
                <li key={index}>{image.name}</li>
              ))}
            </ul>
          </div>

          <div className="adminrestaurant-form-group">
            <input
              type="submit"
              value={isEditMode && restaurantId ? '레스토랑 수정' : '레스토랑 등록'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddRestaurant;
