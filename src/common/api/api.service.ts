import { API } from './api.config';

type RansackPredicate =
  | 'eq'
  | 'not_eq'
  | 'matches'
  | 'does_not_match'
  | 'matches_any'
  | 'matches_all'
  | 'does_not_match_any'
  | 'does_not_match_all'
  | 'lt'
  | 'lteq'
  | 'gt'
  | 'gteq'
  | 'present'
  | 'blank'
  | 'null'
  | 'not_null'
  | 'in'
  | 'not_in'
  | 'lt_any'
  | 'lteq_any'
  | 'gt_any'
  | 'gteq_any'
  | 'lt_all'
  | 'lteq_all'
  | 'gt_all'
  | 'gteq_all'
  | 'not_eq_all'
  | 'start'
  | 'not_start'
  | 'start_any'
  | 'start_all'
  | 'not_start_any'
  | 'not_start_all'
  | 'end'
  | 'not_end'
  | 'end_any'
  | 'end_all'
  | 'not_end_any'
  | 'not_end_all'
  | 'cont'
  | 'cont_any'
  | 'cont_all'
  | 'not_cont'
  | 'not_cont_any'
  | 'not_cont_all'
  | 'i_cont'
  | 'i_cont_any'
  | 'i_cont_all'
  | 'not_i_cont'
  | 'not_i_cont_any'
  | 'not_i_cont_all'
  | 'true'
  | 'false';

type RansackQuery<T> = {
  [key in `${Exclude<keyof T, symbol>}_${RansackPredicate}`]?: any;
} &
  Record<string, any>;

interface Params {
  model_name?: string;
  q?: {
    s?: string | string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export const ApiService = <ModelType = any, ResponseType = any>(resourceName) => {
  const query = <T = ModelType>(params: Params = {}) => async () => {
    const { data } = await API.get<T>(`/${resourceName}`, { params });
    return data;
  };

  const infiniteQuery = <T = ModelType>(params: Params) => async ({ pageParam = 1 }) => {
    const { data } = await API.get<T>(`/${resourceName}?cursor=${pageParam}`, { params });
    return data;
  };

  const get = <T = ModelType>(id: string | number, params: Params = {}) => async () => {
    const { data } = await API.get<T>(`/${resourceName}/${id}`, { params });
    return data;
  };

  const create = <T = ModelType>(params: Params) => async (newObj?: any) => {
    const { data } = await API.post<T>(`/${resourceName}`, { ...newObj, ...params });
    return data;
  };

  // const create = <T = ModelType>(params: Params<T>) => async (payload?: any) => {
  //   const { data } = await API.post<T>(`/${resourceName}`, payload, { params });
  //   return data;
  // };
  const update = <T = ModelType>(id: string | number, params?: Params) => async (payload?: any) => {
    const { data } = await API.patch<T>(`/${resourceName}/${id}`, payload, { params });
    return data;
  };

  // const create = <T = ModelType>(params?: Params) => async (payload?: any) => {
  //   const { data } = await API.post<T>(`/${resourceName}`, payload, { params });
  //   return data;
  // };

  // const update = <T = ModelType>(id: string | number, params: Params = {}) => async (obj?: any) => {
  //   const { data } = await API.patch<T>(`/${resourceName}/${id}`, { ...obj, ...params });
  //   return data;
  // };

  const destroy = <T = ResponseType>(id: string | number, params: Params = {}) => async () => {
    const { data } = await API.delete<T>(`/${resourceName}/${id}`, { params });
    return data;
  };

  return {
    query,
    infiniteQuery,
    get,
    create,
    update,
    destroy,
  };
};
