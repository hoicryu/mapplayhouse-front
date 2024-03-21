import { Address } from '@constants';

export interface Model {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface User extends Model, Address {
  email: string;
  name: string;
  phone: string;
  image_path: string;
  status?: string;
  description?: string;
  provider: string;
}

export interface Banner extends Model {
  image_path: string;
  sub_banner_image: string;
  status: 'active' | 'disabled';
  is_external: boolean;
  link: string;
}
