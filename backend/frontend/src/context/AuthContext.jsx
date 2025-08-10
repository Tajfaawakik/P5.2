import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // トークンをデコードするライブラリ

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'), // ページリロード後もトークンを保持
    user: null,
  });

  // アプリケーション起動時に一度だけ実行
  useEffect(() => {
    if (authState.token) {
      try {
        const decodedUser = jwtDecode(authState.token);
        setAuthState(prev => ({ ...prev, user: decodedUser }));
      } catch (error) {
        // 無効なトークンならクリア
        localStorage.removeItem('token');
        setAuthState({ token: null, user: null });
      }
    }
  }, [authState.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setAuthState({ token, user: decodedUser });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null });
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}