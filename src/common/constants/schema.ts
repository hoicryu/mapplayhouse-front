export interface Model {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface User extends Model {
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

export interface Rating extends Model {
  title: string;
  price: string;
  status: 'main' | 'supporting' | 'ensemble';
}

export interface Part extends Model {
  id: number;
  title: string;
  image: string;
  musical_id: number;
  rating_id: string;
  rating: Rating;
}

export interface Notice extends Model {
  id: number;
  title: string;
  body: string;
  position: number;
  type: string;
}

export interface Musical extends Model {
  id: number;
  title: string;
  body: string;
  _type: string;
  image_path: string;
}

export interface Group extends Model {
  id: number;
  title: string;
  musical_alias: string;
  status: string;
  audition_date: string;
  application_link: string;
  musical: Musical;
  concert_hall: string;
  performance_start_at: string;
  performance_end_at: string;
  submit_end_at: string;
  main_parts: Part[];
  course_start_at: string;
}

export interface Video extends Model {
  id: number;
  title: string;
  youtube_url: string;
  status: string;
  _type: string;
  body: string;
}

export interface Image extends Model {
  id: number;
  model_name: string;
  image_path: string;
}
