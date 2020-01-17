# React SSR

## How to use.
- Developement(WSD) ! warning 등 무시
```
    yarn start:wsd
```
- Developement(SSR)
```
    yarn start
```
- production(with SSR)
```
    yarn start:prd
```
- build:dev
```
    yarn build:dev
    node ./dist/server.js
```
- build:prod
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
- @babel/core : es6 module
- @babel/preset-env : babel env module
- @babel/preset-react : babel react module
- @loadable/babel-plugin
- @loadable/webpack-plugin
- babel-loader
- html-webpack-plugin : 웹팩의 html 플러그인
- webpack : webpack
- webpack-cli : webpack command line interface
- webpack-dev-middleware : [WDM] express 서버에서 파일이 수정될때 변경된 파일과 그 정보를 만들어주는 플러그인
- webpack-dev-server : [WDS] 웹팩 개발 서버 플러그인 webpack.dev.js 에 설정함
- webpack-hot-middleware : [WHM] WDM 이 만들어진 정보를 브라우져에 갱신 시키는 플러그인 (WDS 의 hot 의 기능)
- webpack-node-externals : 번들 파일에 불필요한 node_modules 를 빼주는 역할 (SSR에서는 결과물의 html 만 먼저 보여주는 역할이기에 node_modules 가 필요없음)

## loadable component 개발 가이드
- loadable component import
```
    import loadable from "@loadable/component";
```
- component import
```
    without loadable : import Home from "./components/Home";
    with loadable : const Home = loadable(() => import(/* webpackChunkName : "Home" */ "./components/Home")); // webpakcChunkName 는 webpakc 분할 이름 지정 힌트
```

## config 설명
- webpack.config.js
```
    webpack CLI 실행시 기본적으로 읽는 파일, dev, client, server 를 나누어서 하기 위해 분기 처리만 함. start script 에 --env=dev 이 있으므로webpack.dev.js 를 바라봄
```
- webpack.dev.js
```
    HMR(Hot module replace) 설정
```
