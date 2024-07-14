import { Group } from '@constants';
import React from 'react';
import { Router } from 'framework7/types';
import packageJson from '../../../package.json';

export * from './schema';

/** 리터럴 혹은 불변 객체 */
export const TOKEN_KEY = `${packageJson.name}_TOKEN`;
export const CSRF_KEY = `${packageJson.name}_CSRF`;

export const ACTIONS = {
  NEW: 'new',
  INDEX: 'index',
  EDIT: 'edit',
  SHOW: 'show',
};

export const DEFAULT_ACTIONS = Object.values(ACTIONS);

/** 인터페이스 */
/* User Auth Interfaces */
export interface Token {
  token: null | string;
  csrf: null | string;
}

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  image_path: string;
  point: number;
  provider: string;
  groups_i_applied: number[];
}

export interface AuthState extends Token {
  // isLoading: boolean;
  currentUser: CurrentUser;
}

export interface TokenPayload {
  user: any; // TODO IToknePayload any 타입 변경
}

/* Routes Interfaces */

export interface Route {
  path: string;
  component?: React.FunctionComponent;
  async?: any;
}

export interface ResourceRoute {
  resource: string;
  collection?: string[];
  member?: string[];
  only?: ('show' | 'edit' | 'new' | 'index')[];
}

// Shared

export interface PageRouteProps {
  f7route: Router.Route;
  f7router: Router.Router;
}

export interface Objects<T> {
  total_pages: number;
  total_count: number;
  objects: T[];
}

export interface InfiniteObjects<T> {
  next_cursor: number;
  total_count: number;
  objects: T[];
}

export type ID = string | number;

export interface CustomToastProps {
  open: boolean;
  content: string;
  img?: string;
  position?: string;
}

export interface Groups {
  groups: Group[];
  isError: boolean;
  isSuccess: boolean;
}
