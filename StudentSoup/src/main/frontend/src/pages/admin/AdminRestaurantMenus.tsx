import React, { useEffect, useState } from 'react';
import './adminrestaurantmenus.scss';
import AdminNavbar from './AdminNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import AdminMenuModal from './AdminMenuModal';
import Swal from 'sweetalert2';
interface MenuType {
  cost: number;
  fileName: string | null;
  like: boolean;
  likedCount: number;
  restaurantMenuCategory: string;
  restaurantMenuId: number;
  restaurantMenuName: string;
}
const AdminRestaurantMenus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const restaurantId = location.state?.restaurantId;
  const getRestaurantName = location.state?.restaurantName;
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<{
    menuId: number;
    menuName: string;
    menuCategory: string;
    cost: number;
    fileName: string | null;
  } | null>(null);
  const getMenus = () => {
    axiosInstance
      .get(`/admin/${restaurantId}/restaurantMenus`)
      .then(res => {
        setMenus(res.data[0]);
        console.log(res.data[0]);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    getMenus();
  }, [restaurantId]);

  const handleAddMenuClick = () => {
    setIsOpen(true); // 버튼 클릭시 모달 열기
  };

  const handleCloseModal = () => {
    setIsOpen(false); // 모달 닫기
    setSelectedMenu(null);
    getMenus();
  };

  const handleTableRowClick = async (
    restaurantMenuId: number,
    restaurantName: string,
    menuCategory: string,
    cost: number,
    fileName: string | null,
  ) => {
    Swal.fire({
      title: `${restaurantName}`,
      showDenyButton: true,
      confirmButtonText: '수정',
      denyButtonText: '삭제',
    }).then(result => {
      if (result.isConfirmed) {
        openEditModal(restaurantMenuId, restaurantName, menuCategory, cost, fileName);
      } else if (result.isDenied) {
        Swal.fire({
          title: '정말로 삭제하시겠습니까?',
          text: '이 작업은 되돌릴 수 없습니다.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
        }).then(async deleteResult => {
          if (deleteResult.isConfirmed) {
            await axiosInstance
              .get(`/admin/restaurantMenu/${restaurantMenuId}/${restaurantId}`)
              .then(() => {
                Swal.fire({
                  title: '성공',
                  text: '메뉴가 성공적으로 삭제되었습니다.',
                  icon: 'success',
                  confirmButtonText: '확인',
                }).then(() => {
                  getMenus();
                });
              })
              .catch(err => {
                console.error(err);
              });
          }
        });
      }
    });
  };
  const openEditModal = (
    menuId: number,
    menuName: string,
    menuCategory: string,
    cost: number,
    fileName: string | null,
  ) => {
    setIsOpen(true);
    setSelectedMenu({ menuId, menuName, menuCategory, cost, fileName });
  };

  return (
    <div className="adminpage-maincontainer">
      <AdminMenuModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        restaurantId={restaurantId}
        isEditMode={selectedMenu !== null}
        selectedMenu={selectedMenu}
      />
      <AdminNavbar />
      <div className="adminpage-menu-header">
        <h2>{getRestaurantName}</h2>
      </div>
      <div className="adminpage-add-menu-container">
        <button onClick={handleAddMenuClick} className="adminpage-add-menu-button">
          메뉴 추가
        </button>
      </div>
      <table className="adminrestaurantmenus-table">
        <thead>
          <tr>
            <th>음식 사진</th>
            <th>메뉴 이름</th>
            <th>메뉴 카테고리</th>
            <th>가격</th>
            <th>좋아요 수</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(menu => (
            <tr
              key={menu.restaurantMenuId}
              onClick={async () =>
                await handleTableRowClick(
                  menu.restaurantMenuId,
                  menu.restaurantMenuName,
                  menu.restaurantMenuCategory,
                  menu.cost,
                  menu.fileName,
                )
              }
            >
              <td>
                <img src={`/image/${menu.fileName}` ?? ''} />
              </td>
              <td>{menu.restaurantMenuName}</td>
              <td>{menu.restaurantMenuCategory}</td>
              <td>{menu.cost}원</td>
              <td>{menu.likedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRestaurantMenus;
