import axios from 'axios';
import Qs from 'qs';
import { configs } from '@config';
import { getToken } from '@store';
import { authenticateUserThroughPortal, unAuthenticateUserThroughPortal } from '@components/RecoilRootPortal';

const { API_URL, IMAGE_API_URL, VERSION } = configs;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshInterceptor = (axiosInstance) => (error) => {
  const _axios = axiosInstance;
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.error !== 'Pundit Error') {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return _axios.request(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      const { token: oldToken, csrf: oldCsrf } = getToken();
      axios
        .post(
          `${API_URL}/token`,
          {},
          {
            headers: { 'X-CSRF-TOKEN': oldCsrf, Authorization: `Bearer ${oldToken}` },
          },
        )
        .then((res) => {
          const { csrf, token } = res.data;
          authenticateUserThroughPortal({ csrf, token });
          _axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);
          resolve(_axios(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          unAuthenticateUserThroughPortal();
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  return Promise.reject(error);
};

const headerTokenConfig = (config) => {
  const method = config.method.toUpperCase();
  if (method !== 'OPTIONS') {
    const { csrf, token } = getToken();
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': csrf,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

axios.defaults.paramsSerializer = (params) =>
  Qs.stringify(params, {
    arrayFormat: 'brackets', //! !params.q ? "brackets" : "indices"
  });

const headerConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': `v${VERSION}`,
  },
};

const PlainAPI = axios.create(headerConfig);
const API = axios.create(headerConfig);

API.interceptors.request.use(headerTokenConfig);
API.interceptors.response.use(null, refreshInterceptor(API));

export { PlainAPI, API, API_URL, IMAGE_API_URL, VERSION };
