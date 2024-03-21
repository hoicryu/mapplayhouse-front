import jwt_decode from 'jwt-decode';
import { TokenPayload } from '@constants';
import { forEach } from 'lodash';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const convertObjectToFormData = ({ modelName, data }: { modelName: string; data: any }): FormData => {
  const fd = new FormData();
  forEach(data, (value, key) => {
    if (key === 'images' && value && value.length !== 0) {
      for (let i = 0; i < value.length; i++) {
        fd.append('images[]', value[i]);
      }
    } else {
      fd.append(`${modelName}[${key}]`, `${value}`);
    }
  });
  return fd;
};

export const getCurrentUserFromToken = (token: string) => {
  const { user } = jwt_decode(token) as TokenPayload;
  return user;
};
