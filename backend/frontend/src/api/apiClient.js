import axios from 'axios';

// バックエンドサーバーのURL
const API_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;