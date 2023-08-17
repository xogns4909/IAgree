import React, { useEffect, useState } from 'react';
import './adminrestaurantview.scss';
import AdminNavbar from './AdminNavbar';
import Swal from 'sweetalert2';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
interface RestaurantsType {
  address: string;
  detail: string;
  distance: string;
  endTime: string;
  fileName: string | null;
  like: boolean;
  likedCount: number;
  name: string;
  restaurantCategory: string;
  restaurantId: number;
  starLiked: number;
  startTime: string;
  tag: string;
  viewCount: number;
}

const AdminRestaurantView = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<RestaurantsType[]>();
  const CallRestaurants = async () => {
    await axiosInstance.get('/admin/restaurants').then(res => {
      console.log(res.data);
      setRestaurants(res.data.restaurants);
    });
  };
  useEffect(() => {
    CallRestaurants();
  }, []);
  const handleRowClick = (restaurantId: number, restaurantName: string) => {
    Swal.fire({
      title: `${restaurantName}`,
      html: `
        <div>
          <button id="edit-menu" class="custom-swal-button">메뉴 관리</button>
          <button id="edit-restaurant" class="custom-swal-button">음식점 수정</button>
          <button id="delete-restaurant" class="custom-swal-button">음식점 삭제</button>
        </div>
      `,
      showConfirmButton: false,
      focusConfirm: false,
      willOpen: () => {
        document.getElementById('edit-menu')?.addEventListener('click', () => {
          navigate('/admin/restaurant/menus', { state: { restaurantId, restaurantName } });
          Swal.close();
        });
        document.getElementById('edit-restaurant')?.addEventListener('click', () => {
          navigate('/admin/restaurant', { state: { isEditMode: true, restaurantId } });
          Swal.close();
        });
        document.getElementById('delete-restaurant')?.addEventListener('click', () => {
          Swal.fire({
            title: '정말 해당 음식점을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
          }).then(result => {
            if (result.isConfirmed) {
              handleDeleteRestaurant(restaurantId);
            }
          });
        });
      },
    });
  };
  const handleDeleteRestaurant = async (restaurantId: number) => {
    await axiosInstance
      .get(`/admin/restaurant/${restaurantId}`)
      .then(res => {
        Swal.fire('음식점이 삭제되었습니다.', '', 'success');
        CallRestaurants();
      })
      .catch(() => {
        Swal.fire('알 수 없는 오류가 발생하였습니다.', '', 'error');
      });
  };

  return (
    <div className="adminpage-maincontainer">
      <AdminNavbar />
      <div>
        <h1>음식점 목록</h1>
        <table className="adminrestaurantview-table">
          <thead>
            <tr>
              <th>식당 이름</th>
              <th>세부 정보</th>
              <th>주소</th>
              <th>오픈 시간</th>
              <th>마감 시간</th>
              <th>카테고리</th>
              <th>태그</th>
            </tr>
          </thead>
          <tbody>
            {restaurants?.map((restaurant, index) => (
              <tr
                key={restaurant.restaurantId}
                onClick={() => handleRowClick(restaurant.restaurantId, restaurant.name)}
              >
                <td>{restaurant.name}</td>
                <td>{restaurant.detail}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.startTime}</td>
                <td>{restaurant.endTime}</td>
                <td>{restaurant.restaurantCategory}</td>
                <td>{restaurant.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRestaurantView;
