import axios from 'axios';

// バックエンドサーバーのURL
const API_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// APIリクエストを送信する直前の共通処理
apiClient.interceptors.request.use(
  (config) => {
    // ブラウザのlocalStorageからトークンを取得
    const token = localStorage.getItem('token');
    // トークンがあれば、リクエストヘッダーに付与
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;