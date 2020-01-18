# React SSR

## 시작 전에

CRA를 사용하지 않는 React + SSR + Code splitting 구조

DylanJu 님의 React SSR 구축하기에서 아래와 같은 수정을 하였습니다.
- typescript 제거
- production 에서 WDM, WHM 제거
- scripts 를 변경
- js 번들명을 chunkhash 로 변경
- 이미지 hash 연동 추가 
- css hash 연동 추가
- development 의 SSR 빌드 시 style의 HMR 적용 하려 style-loader 적용 하니 node 버전을 제공하지 안하 서버 렌더링 화면에서는 CSS 가 없음, CRS 모드로 전환 되면 바로 적용, (수정 예정)
- typescript를 같이 사용하시거나 DylanJu 님의 원본 및 코드 설명을 보시려면 [Github : react-typescript-ssr-codeSplitting](https://github.com/DylanJu/react-typescript-ssr-codeSplitting) 으로 이동하세요 


## How to use.
- Developement(WSD) : WDS 기반 스타트 초기 warning 무시 (SSR 설정 때문), 대부분의 개발은 이것을 사용하면서 개발 후 yarn start:prd 에서 확인 하자
```
    yarn start
```
- Developement(SSR) : SSR 기반 스타트 (HMR 적용), 다만 초기 서버 렌더링 부분 CSS 아직 미해결
```
    yarn start:dev
```
- production(SSR) : SSR 기반 운영 배포 소스 기반 스타트, HMR 미적용, 파일 hash, 난독화 적용
```
    yarn start:prd
```
- build:dev : 개발 버전 빌드
```
    yarn build:dev
    node ./dist/server.js
```
- build : 운영 버전 빌드, (파일 hash, 난독화 적용)
```
    yarn build
    node ./dist/server.js
```

## include packages
### dependencies
- @loadable/component : component code splitting (lazy loading) module
- @loadable/server : SSR code splitting (lazy loading) module
- express : SSR node WAS
- react : react module
- react-dom : react module
- react-helmet : react <head /> controle module
- react-router-dom : react router module
### devDependencies
- @babel/core : babel core
- @babel/preset-env : babel module
- @babel/preset-react : babel react module
- @loadable/babel-plugin : loadable component babel module
- @loadable/webpack-plugin : loadable component webpack module
- babel-loader : babel
- html-webpack-plugin : 웹팩의 html 플러그인
- webpack : webpack
- webpack-cli : webpack command line interface
- webpack-dev-middleware : [WDM] express 서버에서 파일이 수정될때 변경된 파일과 그 정보를 만들어주는 플러그인
- webpack-dev-server : [WDS] 웹팩 개발 서버 플러그인 webpack.dev.js 에 설정함
- webpack-hot-middleware : [WHM] WDM 이 만들어진 정보를 브라우져에 갱신 시키는 플러그인 (WDS 의 hot 의 기능)
- webpack-node-externals : 번들 파일에 불필요한 node_modules 를 빼주는 역할 (SSR에서는 결과물의 html 만 먼저 보여주는 역할이기에 node_modules 가 필요없음)
- file-loader : 웹팩에서 이미지등 파일을 복사하는 모듈
- url-loader : 웹펙에서 이미지등 파일을 스트링으로 가지고 있는 모듈
- clean-webpack-plugin : 웹팩 dist 클린 플러그인
- sass-loader : webpack sass loader
- node-sass : sass-loader 에서 필요
- css-loader : css 파일 로더
- style-loader : html 의 style 태그에 css를 넣음
- mini-css-extract-plugin : css 로더의 결과를 css 파일로 생성

## loadable component 개발 가이드
- loadable component import
```
    import loadable from "@loadable/component";
```
- component import
```
    without loadable : import Home from "./components/Home";
    with loadable : const Home = loadable(() => import(/* webpackChunkName : "Home" */ "./components/Home")); // webpakcChunkName 는 webpakc chunk 이름 지정 힌트
```

## image 적용 가이드

이미지를 현재 component의 상대 경로로 입력 해야 한다.
그래야 cache 전략을 위한 [name].[exe]?[chunkhash] 가 붙는다.
```
import React from "react";
import shibaImg from "../assets/images/shiba.jpg";

export default () => (
    <img src={shivaImg} alt={shivaImg} />
)
```

## CSS 적용 가이드

- 단일 컴퍼넌트 기반 적용 방법

/src/pages/Homd.js
```
import './Home.css';

export default () => (
    <div className="home">
        <div className="bg">...</div>
    </div>
)
```
/src/pages/Home.scss
```
.home {
    .bg {
        display: block;
        width: 100%;
        height: 100px;
        background-color: #0FF;
    }
}
```

## Webpack config 주의 사항
- publicPath : 배포 경로가 아닌 webpack 의 연결 path. 실제 저장소와 무관련,
 /dist/web/ 이 아니라 /assets/web/ 등으로 입력
- modules > rule 의 기본작성 법
```
[
    {
        test: ${regex}  // 대상의 찾을 수 있는 정규식
        use: [  // Array로 test 에 걸리는 파일을 처리할 로더 정의 (밑에서 위로, 우에서 좌로 순차적으로 적용)
            {
                loader: ${loader}
                options: {
                    publicPath: ${path}
                    name: '[name].[ext]?[hash]'
                }
            },
            ...
        ]
    }
]
```
- mode : webpack V4 에서 새로 나옴 development, production 두가지 값을 가질 수 있으며 production 의 경우 자동적으로 난도고하 등을 한다. 따라서 난독화 등의 plugin 등을 넣으면 안된다. (!충돌날 수 있음)
- webpack.client.js 는 web, node 두번 하는 이유는 CRS 에서 사용할 web, SSR 에서 사용할 node 라고 생각하면 된다. SSR은 node 에서 사용 할것이기 때문에 일부 loader, plugin 등이 동작하지 않는다. 따라서 분기 처리 해줘야 함
- Webpack Develope Server : html을 자동으로 HotModuleRplace(이하 HMR) 해주는 완소 서버 모듈

## server.js 주의 사항
- 최초 화면만 url을 가져와 jsx 를 만들고 html string으로 변환 및 CRS 하기 위한 webStats 를 loading 시킴
- 개발모드에서는 webpack-dev-middleware, webpack-hot-middleware 를 사용해서 start 하며, 운영모드에서는 사용하지 않고 express의 reouter middleware 를 사용한다.
- 개발모드에서 CSS를 SSR 모드에서 못가져 오는 문제는 HMR 적용하기 위한 style-loader 를 사용시 node 에서 사용할 수 없는 문제 가있다. 따라서 첫번째 화면에서 사용하는 cSS를 찾아서 강제 link 태그 추가 해 주는 방법이 있다.  <style /> 가 우선순위가 높기에 CSR에서 덮어 버릴테니깐.