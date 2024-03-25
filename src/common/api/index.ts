import { LineItemParams, Token, CreateLineItemProps, ID, Image, Order } from '@constants';
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
export const { query: getOrders, infiniteQuery: getInfiniteOrders, destroy: destroyOrder } = ApiService<Order>(
  'orders',
);
export const { get: getReview } = ApiService('reviews');

export const nonPaymentOrder = (id) => async (params) => {
  const { data } = await API.put(`/orders/${id}/non_payment`, params);
  return data;
};

export const postExchangeReturn = (params) => async (newObj) => {
  const { data } = await API.post('/orders/exchange_return', { ...newObj, ...params });
  return data;
};

export const getCurrentUser = () => async () => {
  const { data } = await API.get('/users/me');
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

export const createLike = () => async (params) => {
  const { data } = await API.post('/likes', params);
  return data;
};

export const deleteLike = () => async (id: ID) => {
  const { data } = await API.delete(`/likes/${id}`);
  return data;
};

export const getMarkets = (params) => async () => {
  const { data } = await API.get(`/markets`, { params });
  return data;
};

export const getHomeCategories = (marketId: ID) => async () => {
  const { data } = await API.get(`/markets/${marketId}/categories`);
  return data;
};

export const getSubCategories = (params) => async () => {
  const { data } = await API.get('/categories/subcategories', { params });
  return data;
};

export const getInfiniteMarketItems = (marketId: ID, params) => async ({ pageParam = 1 }) => {
  const { data } = await API.get(`/markets/${marketId}/market_items?cursor=${pageParam}`, { params });
  return data;
};

// OnSale에서 전체 마켓상품 불러올 때 사용
export const getMarketItems = (marketId: ID, params) => async () => {
  const { data } = await API.get(`/markets/${marketId}/market_items`, { params });
  return data;
};

export const getOrderMarketId = () => async () => {
  const { data } = await API.get(`/orders/market_id`);
  return data;
};

export const deleteAllLineItem = () => async () => {
  const { data } = await API.delete(`/orders/all_line_items`);
  return data;
};

export const getLineItemsByOrder = (orderId: ID, params = null) => async () => {
  const { data } = await API.get(`/orders/${orderId}/line_items`, { params });
  return data;
};

export const getShortageStockLineItemIdsByOrder = (orderId: ID) => async () => {
  const { data } = await API.get(`/orders/${orderId}/line_items/check_shortage_stock_ids`);
  return data;
};

export const buyNowOrder = () => async (params) => {
  const { data } = await API.post(`/orders/buy_now_order`, params);
  return data;
};

export const getLineItems = () => async () => {
  const { data } = await API.get(`/line_items`);
  return data;
};

export const createLineItem = () => async (params: LineItemParams<CreateLineItemProps>) => {
  const { data } = await API.post('/line_items', params);
  return data;
};

export const deleteLineItem = () => async (lineItemId: ID) => {
  const { data } = await API.delete(`/line_items/${lineItemId}`);
  return data;
};

export const changeLineItemQuantity = (lineItemId: ID) => async (params) => {
  const { data } = await API.put(`/line_items/${lineItemId}/quantity`, params);
  return data;
};

export const changeLineItemCheck = (lineItemId: ID) => async () => {
  const { data } = await API.put(`/line_items/${lineItemId}/check`);
  return data;
};

export const updateLineItemsCheck = () => async () => {
  const { data } = await API.put(`/line_items/checked`);
  return data;
};

export const deleteLineItemsCheck = () => async () => {
  const { data } = await API.delete(`/line_items/checked`);
  return data;
};

export const checkLineItems = (orderId: ID) => async (params) => {
  const { data } = await API.get(`/orders/${orderId}/check_line_items`, { params });
  return data;
};

export const deleteSoldOutLineItems = () => async () => {
  const { data } = await API.delete(`/line_items/sold_outs`);
  return data;
};

export const getLikedTargets = (targetType: string) => async () => {
  const { data } = await API.get(`/likes/targets?target_type=${targetType}`);
  return data;
};

export const updateMarketId = () => async (params) => {
  const { data } = await API.put(`/users/market_id`, params);
  return data;
};

export const getLastMarketId = () => async () => {
  const { data } = await API.get(`/users/last_market_id`);
  return data;
};

export const getMyReviews = () => async () => {
  const { data } = await API.get(`/reviews`);
  return data;
};

export const postReview = () => async (params) => {
  const { data } = await API.post(`/reviews`, params);
  return data;
};

export const putReview = (reviewId: ID) => async (params) => {
  const { data } = await API.put(`/reviews/${reviewId}`, params);
  return data;
};

export const deleteReview = (reviewId: ID) => async (params) => {
  const { data } = await API.delete(`/reviews/${reviewId}`, params);
  return data;
};

export const postQuery = () => async (params) => {
  const { data } = await API.post(`/queries`, params);
  return data;
};

export const deleteQuery = () => async (id: ID) => {
  const { data } = await API.delete(`/queries/${id}`);
  return data;
};

export const getContacts = (params) => async () => {
  const { data } = await API.get('/contacts', { params });
  return data;
};

export const postContact = () => async (params) => {
  const { data } = await API.post('/contacts', params);
  return data;
};

export const putContact = (contactId: ID) => async (params) => {
  const { data } = await API.put(`/contacts/${contactId}`, params);
  return data;
};

export const deleteContact = () => async (contactId: ID) => {
  const { data } = await API.delete(`/contacts/${contactId}`);
  return data;
};

export const getCoupons = () => async () => {
  const { data } = await API.get('/coupons');
  return data;
};

export const getDownloads = (params) => async () => {
  const { data } = await API.get('/downloads', { params });
  return data;
};

export const getPointHistories = () => async () => {
  const { data } = await API.get('/point_histories');
  return data;
};

export const postDownloads = () => async (params) => {
  const { data } = await API.post('/downloads', params);
  return data;
};

export const checkUsableDownload = async (params) => {
  const { data } = await API.get(`/downloads/check_usable`, { params });
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

export const getCheckEmailOverlap = async (params) => {
  const { data } = await API.get('/users/check_email_overlap', { params });
  return data;
};

export const getRecentAddress = () => async () => {
  const { data } = await API.get('/users/recent_address');
  return data;
};

export const postRecentAddress = () => async (params) => {
  const { data } = await API.post('/recent_addresses', params);
  return data;
};

export const putRecentAddress = () => async (recent_address_id: ID) => {
  const { data } = await API.put(`/recent_addresses/${recent_address_id}`);
  return data;
};

export const getOrderNumberUpdate = (orderId: ID) => async () => {
  const { data } = await API.get(`/orders/${orderId}/number_update`);
  return data;
};

export const putOrderPartialCancel = (orderId: ID) => async (params) => {
  const { data } = await API.put(`/orders/${orderId}/cancel`, params);
  return data;
};

export const getUnwrittenReviewAmount = () => async () => {
  const { data } = await API.get('/reviews/count_unwritten_reviews');
  return data;
};

export { API_URL, IMAGE_API_URL, VERSION };
