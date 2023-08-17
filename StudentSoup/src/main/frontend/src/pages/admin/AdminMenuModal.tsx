import React, { useEffect, useRef, useState } from 'react';
import './adminmenumodal.scss';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import Swal from 'sweetalert2';
interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  isEditMode: boolean;
  selectedMenu: {
    menuId: number;
    menuName: string;
    menuCategory: string;
    cost: number;
    fileName: string | null;
  } | null;
}
type CategoryType = 'Main' | 'Side' | 'Drink';
const AdminMenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  isEditMode,
  selectedMenu,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(isEditMode);
  useEffect(() => {
    if (isEditMode && selectedMenu) {
      setName(selectedMenu.menuName);
      setCategory(selectedMenu.menuCategory);
      setPrice(selectedMenu.cost.toString());
    }
  }, [isEditMode, selectedMenu]);
  const categoryMapping: Record<CategoryType, string> = {
    Main: '메인메뉴',
    Side: '사이드 메뉴',
    Drink: '음료 및 주류',
  };
  const reverseCategoryMapping: Record<string, CategoryType> = {
    주메뉴: 'Main',
    사이드메뉴: 'Side',
    '음료 및 주류': 'Drink',
  };
  const initializeForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append('restaurantId', restaurantId.toString());
      formData.append('name', name);
      if (isEditMode && selectedMenu) {
        const categoryType = reverseCategoryMapping[selectedMenu.menuCategory]; // 카테고리 변환
        formData.append('restaurantMenuCategory', categoryType);
      } else {
        formData.append('restaurantMenuCategory', category);
      }
      formData.append('cost', price);

      if (image) {
        formData.append('multipartFile', image);
      }

      let url = '/admin/restaurantMenu';
      if (isEditMode && selectedMenu) {
        url = `/admin/restaurantMenu/edit/${selectedMenu.menuId}`; // 수정 모드 URL
      }

      await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        title: '성공',
        text: isEditMode
          ? '메뉴가 성공적으로 수정되었습니다.'
          : '메뉴가 성공적으로 등록되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      }).then(result => {
        onClose();
        if (result.isConfirmed) {
          initializeForm();
        }
      });
    } catch (error) {
      alert('메뉴 등록에 실패했습니다.');
    }
  };
  const handleImageRemove = () => {
    setImage(null);
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const getRestaurantMenus = async () => {
    await axiosInstance
      .get('/admin/restaurantMenu')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    getRestaurantMenus();
  }, []);
  return (
    <div className={`adminmenumodal-menu-modal ${isOpen ? 'open' : ''}`}>
      <div className="adminmenumodal-menu-modal-content">
        <div>음식점 추가</div>
        <input
          type="text"
          placeholder="메뉴 이름"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select value={category} onChange={e => setCategory(e.target.value)} disabled={isEditMode}>
          <option value="">{isEditMode ? category : '카테고리를 선택해주세요.'}</option>
          {categories.map((option, index) => (
            <option key={index} value={option}>
              {categoryMapping[option]}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0] ?? null;
            setImage(file);
            if (file) {
              const reader = new FileReader();
              reader.onload = e => {
                setPreviewImage(e.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {previewImage && (
          <div className="adminmenumodal-imgcontainer">
            <img src={previewImage} alt="Preview" />
            <button className="adminmenumodal-delete-image-button" onClick={handleImageRemove}>
              사진 삭제
            </button>
          </div>
        )}
        <div className="adminmenumodal-bottom-button">
          <button onClick={handleSubmit}>저장</button>
          <button
            onClick={() => {
              onClose();
              initializeForm();
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuModal;
