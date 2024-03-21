# React cdk deploy

## 소개

- React 앱 배포는 S3를 통해 이뤄집니다.
- Cloudfront를 통해 캐싱하고, route53 A record - alias 를 통해 도메인과 연결합니다
- 프론트 엔드만 배포하는 코드입니다. API서버는 따로 구성 해야합니다.
- 배포 시 매번 사용하게됩니다.

## 사용법

- https://insomenia.com/posts/325 을 먼저 설정해주세요

- https://github.com/insomenia/host-cdk 을 먼저 설정해주세요

- 프로젝트에 `react-cdk` 폴더가 없을 경우 `react-cdk` 를 프론트엔드 프로젝트 루트에 클론합니다.

  `git clone git@github.com:insomenia/react-cdk.git`

- `react-cdk` 폴더에 `.env.development` ( 실서버는 `.env.production` ) 를 생성하고 작성합니다.

- 큰 따옴표(")는 제거하고 작성해주세요.

```sh
##### 계정: Number #####
ACCOUNT=""

###### [A-Za-z][A-Za-z0-9-] 알파벳으로 시작 해야합니다 .... #####
APP_NAME=Bone

######### barber.work 우리 회사의 도메인을 사용 시 ( 테스트서버 ) ##########
######### DOMAIN / URL동일하게 서브도메인으로 ##########
#  DOMAIN=bone.barber.work
#  URL=bone.barber.work

DOMAIN=barber.work
URL=bone.barber.work

```

- 환경변수 URL / DOMAIN ( https://github.com/insomenia/host-cdk 을 먼저 설정해주세요 !!! )

 👉👉👉프론트엔드와 연결할 URL 입니다👈👈👈

  1. 테스트서버인 경우 ( \*.barber.work 사용 할 때 )

     - 고객사 계정 사용 시

       - `DOMAIN` 과 `URL` 을 동일하게 입력합니다

         ```shell
         DOMAIN=bone.barber.work
         URL=bone.barber.work
         ```

  2. 실서버 인 경우 ( 고객사에게 받은 도메인으로 설정하세요 !! URL을 서브도메인 사용하는 것은 선택입니다. )
  
     ‼️👉👉👉‼️ 도메인을 산 사이트에서 네임서버 변경을 해야합니다!!!!! 네임서버는 host-cdk를 통해 나온 것으로 변경합니다‼️👈👈👈‼️
     ```shell
     ######### 고객사의 도메인을 사용 시 ( 실서버 ) ##########
     ######### 자유, 필요에따라 서브도메인 사용 #########
     #  DOMAIN=seongjun.kr
     #  URL=seongjun.kr or web.seongjun.kr
     DOMAIN=seongjun.kr
     URL=bone.seongjun.kr
     ```

- 배포 전 확인 할 것들

  - `./build/build.js` 의 경로를 확인합니다. ( `./www` 로 되어있어야 합니다. )
    ![image](https://user-images.githubusercontent.com/72075148/118094243-7248a180-b409-11eb-90a7-b35c04c4ba9c.png)
  - `./build/webpack.config.js` 의 output 경로를 확인합니다. ( `./www` 로 되어있어야 합니다.)
    ![image](https://user-images.githubusercontent.com/72075148/118094375-9c9a5f00-b409-11eb-97af-9a8cf7d81abd.png)

  - 설정한 폴더 `www`가 없다면 생성해주세요!
    ![image](https://user-images.githubusercontent.com/72548112/120283750-7bd17500-c2f6-11eb-8fc0-c9c86a860584.png)

- 배포 시작

```shell
# react-cdk
cd react-cdk
yarn install

# react-cdk 폴더에서 명령어를 입력합니다.
# bootstrap은 맨처음 한번만 하면 됩니다.
yarn cdk bootstrap --profile 프로필명


# 1. 직접 cdk deploy 하기
# 배포 전 프론트 폴더에서
yarn build
cd react-cdk
yarn deploy --profile 프로필명 --all
# .env.production 을 셋팅했다면
NODE_ENV=production yarn deploy --profile 프로필명 --all

# 2. packagejson scripts 로 하기
yarn deploy --profile 프로필명 --all
```

## 끝

- 앞으로 프론트엔드 배포 시 `yarn deploy --profile 프로필명 --all` 을 치면 됩니다.

### 배포한 인프라 지우기 ( 할일 거의 없지만 참고 )

`cdk destroy` 를 하면 되는데 S3, Lambda는 cli로 삭제가 불가능합니다. 버킷내의 오브젝트들이 모두 지워져있는 상태여야 가능합니다. 직접 aws로 들어가서 해당하는 S3 버킷을 모두 지워주세요.
