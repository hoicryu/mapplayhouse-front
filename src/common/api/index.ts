import { Token, ID } from '@constants';
import { getToken } from '@store';
import { PlainAPI, API, VERSION, API_URL, IMAGE_API_URL } from './api.config';
import { ApiService } from './api.service';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);
export const loginAPI = (params: FormData) => PlainAPI.post('/login', params);
export const logoutAPI = () => API.delete('/logout');
export const signupAPI = (params: any) => PlainAPI.post('/signup', { user: params });
/* TODO : parameter type 지정 (위에는 샘플로 해두었습니다) */
export const getSmsAuth = (params) => API.get('/phone_certifications/sms_auth', { params });
export const paymentSuccessOrder = (params) => API.get(`/orders/payment`, { params });
export const updateItemImage = (id, params: FormData) => API.patch(`/items/${id}`, params);
export const oauthLoginApi = (url, params) => PlainAPI.post(url, params);
export const checkOrderApi = () => API.get(`/orders/check_order`);
/* TODO */

// 일반적인 경우는 Ojbect API 사용하기
export const {
  query: getObjects,
  infiniteQuery: getInfiniteObjects,
  get: getObject,
  create: createObject,
  update: updateObject,
  destroy: destroyObject,
} = ApiService('objects');

export const { infiniteQuery: getInfiniteItems, get: getItem } = ApiService('items');
export const { get: getMarket } = ApiService('markets');
export const { query: getCategories } = ApiService('categories');
export const { query: getLikes } = ApiService('likes');
export const { query: getImages, destroy: destroyImage } = ApiService<Image>('images');
export const {
  query: getOrders,
  infiniteQuery: getInfiniteOrders,
  destroy: destroyOrder,
} = ApiService<Order>('orders');
export const { get: getReview } = ApiService('reviews');

export const getCurrentUser = () => async () => {
  const { data } = await API.get('/users/me');
  return data;
};
export const getFindEmail = async (params) => {
  const { data } = await API.get('/users/find_email', { params });
  return data;
};

export const postFindOrChangePassword = () => async (params) => {
  const { data } = await API.post('/users/find_or_change_password', params);
  return data;
};

export const createImage = () => async (params) => {
  const { data } = await API.post(`/images`, params);
  return data;
};

export const userEditAPI = (id) => async (params) => {
  const { data } = await API.put(`/users/${id}`, params);
  return data;
};

export const getBeforePerformGroup = () => async () => {
  const { data } = await API.get('/groups/before_perform');
  return data;
};

export const getVideos = () => async () => {
  const { data } = await API.get('/videos');
  return data;
};

export { API_URL, IMAGE_API_URL, VERSION };
