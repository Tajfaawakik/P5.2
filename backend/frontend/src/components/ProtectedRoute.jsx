import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute() {
  const { token } = useAuth();

  // トークンがなければ（ログインしていなければ）ログインページにリダイレクト
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ログインしていれば、子コンポーネント（各ページ）を表示
  return <Outlet />;
}

export default ProtectedRoute;