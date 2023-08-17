import Board from 'pages/board/Board';
import BoardDetail from 'pages/board/BoardDetail';
import BoardWrite from 'components/boards/BoardWrite';
import MainNavbar from 'components/common/MainNavbar';
import NoticeAndServiceDetail from 'components/common/NoticeAndServiceDetail';
import PrivateRoute from 'components/common/PrivateRoute';
import CustomerService from 'pages/customerservice/CustomerService';
import Err404 from 'pages/err404/Err404';
import Home from 'pages/home/Home';
import FindAccount from 'pages/login/FindAccount';
import Login from 'pages/login/Login';
import MypageMain from 'pages/mypage/MypageMain';
import MypageScheduler from 'pages/mypage/MypageScheduler';
import Notice from 'pages/notice/Notice';
import Restaurant from 'pages/restaurant/Restaurant';
import RestaurantDetail from 'pages/restaurant/RestaurantDetail';
import RestaurantNavbar from 'pages/restaurant/RestaurantNavbar';
import SignUpProcess1 from 'pages/signup/SignUpProcess1';
import SignUpProcess2 from 'pages/signup/SignUpProcess2';
import SignUpProcess3 from 'pages/signup/SignUpProcess3';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Adminpage from 'pages/admin/Adminpage';
import AdminAddRestaurant from 'pages/admin/AdminAddRestaurant';
import AdminRestaurantView from 'pages/admin/AdminRestaurantView';
import AdminRestaurantMenus from 'pages/admin/AdminRestaurantMenus';
import AdminSchoolListView from 'pages/admin/AdminSchoolListView';
import AdminDepartmentListView from 'pages/admin/AdminDepartmentListView';

const Router = () => {
  return (
    <Routes>
      <Route path="*" element={<Err404 />} />
      <Route path="/" element={<MainNavbar />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/findAccount" element={<FindAccount />} />
        <Route path="/signup/process/1" element={<SignUpProcess1 />} />
        <Route path="/signup/process/2" element={<SignUpProcess2 />} />
        <Route path="/signup/process/3" element={<SignUpProcess3 />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/detail/:boardId" element={<NoticeAndServiceDetail />} />
        <Route path="/customerservice" element={<CustomerService />} />
        <Route path="/customerservice/detail/:boardId" element={<NoticeAndServiceDetail />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<RestaurantNavbar />}>
          <Route path="/restaurant/:school" element={<Restaurant />} />
          <Route path="/restaurant/detail" element={<RestaurantDetail />} />
        </Route>
        <Route element={<MainNavbar />}>
          <Route path="/board" element={<Board />} />
          <Route path="/board/detail/:boardId" element={<BoardDetail />} />
          <Route path="/board/write" element={<BoardWrite />} />
        </Route>
        <Route path="/mypage" element={<MypageMain />} />
        <Route path="/mypage/scheduler" element={<MypageScheduler />} />
        <Route path="/admin" element={<Adminpage />} />
        <Route path="/admin/restaurant" element={<AdminAddRestaurant />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantView />} />
        <Route path="/admin/restaurant/menus" element={<AdminRestaurantMenus />} />
        <Route path="/admin/schools" element={<AdminSchoolListView />} />
        <Route path="/admin/departments" element={<AdminDepartmentListView />} />
      </Route>
    </Routes>
  );
};

export default Router;
