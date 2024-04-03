export const configs = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
  IMAGE_API_URL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
  SERVICE_URL: process.env.SERVICE_URL || 'http://localhost:8080',
  ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.VERSION || '1',
  KAKAO_SDK: process.env.KAKAO_SDK,
  KAKAO_TOKEN: process.env.KAKAO_TOKEN,
  KAKAO_REDIRECT: process.env.KAKAO_REDIRECT,
  NAVER_SDK: process.env.NAVER_SDK,
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_REDIRECT: process.env.SERVICE_URL,
  NAVER_API_REDIRECT: process.env.NAVER_API_REDIRECT,
};

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
