import _ from 'lodash';
import HomePage from '@pages/home';
import LoginPage from '@pages/users/sessions/new';
import SignUpPage from '@pages/users/registrations/new';
import { ResourceRoute } from '@constants';
import IntroPage from '@pages/intro';
import MyPage from '@pages/mypage';
import SearchPage from '@pages/search';
import MarketItemIndexPage from '@pages/market_items';
import MarketIndexPage from '@pages/markets';
import UserEditPage from '@pages/users/registrations/edit';
import discountListPage from '@pages/markets/discountList';
import LikeMarketListPage from '@pages/likes/marketList';
import AgreePage from '@pages/users/registrations/agree';
import CSPage from '@pages/customer_centers/index';
import CSEmailPage from '@pages/customer_centers/email';
import CSPartnershipPage from '@pages/customer_centers/partnership';
import FindEmailPage from '@pages/users/find_email';
import FindPasswordPage from '@pages/users/find_password';
import ChangePasswordPage from '@pages/users/change_password';
import MarketListsPage from '@pages/reviews/market_lists';
import MarketItemListsPage from '@pages/reviews/market_item_lists';
import todayPage from '@pages/coupons/today';
import DeliveryStatusPage from '@pages/orders/delivery_status';
import CancelPage from '@pages/orders/cancel';
import CancelInfoPage from '@pages/orders/cancel_info';
import ReviewImagesPage from '@pages/reviews/images';
import SelectItemsPage from '@pages/exchange_returns/select_items';
import { mapResourceRoute, mapAsyncRoute, mergeRoutes } from './routes.utils';

/**
 * @resourceRoutes
 * @param {String} resource (required)
 * @param {Array} only (optional)
 * ex) ['show'] -> [{ path: 'items/:id', component: '@pages/items/show.{jsx|tsx}'}]
 * only 를 명시 안해주면 show, index, new, edit 을 모두 탐색 합니다.
 *
 * @param {Array} collection (optional)
 * ex) ['buy'] -> [{ path: 'items/buy', component: '@pages/items/buy.{jsx|tsx}'}]
 *
 * @param {Array} member (optional)
 * ex) ['my_item'] -> [{ path: 'items/:id/my_item', component: '@pages/items/my_item.{jsx|tsx}'}]
 */
const resourceRoutes: ResourceRoute[] = [
  {
    resource: 'items',
  },
  {
    resource: 'users',
  },
  {
    resource: 'posts',
  },
  {
    resource: 'notices',
  },
  {
    resource: 'faqs',
  },
  {
    resource: 'line_items',
  },
  {
    resource: 'categories',
  },
  {
    resource: 'contacts',
  },
  {
    resource: 'likes',
    only: ['index'],
  },
  {
    resource: 'orders',
    only: ['show', 'index'],
    collection: ['delivery_status'],
  },
  {
    resource: 'payments',
    only: ['show'],
  },
  {
    resource: 'market_items',
    only: ['show'],
  },
  {
    resource: 'payments',
    only: ['show'],
    collection: ['result'],
  },
  {
    resource: 'reviews',
    only: ['index', 'new', 'edit', 'show'],
  },
  {
    resource: 'events',
    only: ['index', 'show'],
  },
  {
    resource: 'terms',
    only: ['index', 'show'],
  },
  {
    resource: 'coupons',
    only: ['index', 'new'],
  },
  {
    resource: 'point_histories',
    only: ['index'],
  },
  {
    resource: 'exchange_returns',
    only: ['index', 'new'],
  },
];

/**
 * @customRoutes
 * @param {String} path (required)
 * @param {Array} component (required)
 */
const customRoutes = [
  { path: '/', component: HomePage },
  { path: '/intro', component: IntroPage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/users/edit', component: UserEditPage },
];

/**
 * @asyncRoutes
 * @param {String} path (required)
 * @param {React.FC} component (required)
 * asyncRoutes 랑 path 가 중복되면 asyncRoute 를 우선 적용
 */
const asyncRoutes = [];

const mappedResourceRoutes = resourceRoutes
  .map((resource) => mapResourceRoute(resource))
  .reduce((acc, routes) => [...acc, ...routes], []);

const mappedAsyncRoutes = asyncRoutes.map((route) => mapAsyncRoute(route));

export default mergeRoutes(customRoutes, mappedResourceRoutes, mappedAsyncRoutes);
