export const configs = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
  IMAGE_API_URL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
  SERVICE_URL: process.env.SERVICE_URL || 'http://0.0.0.0:8080',
  ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.VERSION || '1',
  TOSS_CLIENT_KEY: process.env.TOSS_CLIENT_KEY || 'test_ck_YZ1aOwX7K8mK7dlKyJ0VyQxzvNPG',
};

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
