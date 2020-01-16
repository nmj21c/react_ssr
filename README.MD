# React SSR

## How to use.
- 개발(without SSR)
```
    yarn start
```
- 개발(with SSR)
```
    yarn start:ssr
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

## env1 (Webpack + react + babel)
- yarn init -y && git init
- yarn add react react-dom
- src/App.js src/index.js 생성
- yarn add --dev webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader
- webpack.config.js 생성
```
    webpack.config.js : CLI로 webpack을 실행하면 기본적으로 webpack.config.js라는 파일을 봅니다. 지금은 env 설정을 받아서 해당 config를 대신 전달해주는 router 역할만 해주고 있습니다. WDS를 실행할 때 dev라는 parameter를 전달해주면 webpack.dev.js 설정으로 실행됩니다.
```
- webpack.dev.js 생성
```
    webpack.dev.js WDS는 개발모드이므로 mode는 development로, entry 파일은 index.tsx 로 해줍니다.
    
    module : Typescript와 babel이 모두 작동하도록 설정해둡니다. loader는 오른쪽에서 왼쪽으로 실행되므로 babel-loader 이후에 ts-loader가 오도록 순서를 신경써주세요.
    
    resolve : extensions의 경우 Javascript와 Typescript를 모두 읽을 수 있도록 해줍니다. 우리가 작성하는 클라이언트 파일은 모두 Typescript로 작성하지만 WDS가 serve하는 파일은 Javascript 이기 때문입니다.
    
    plugins : Hot Module Replacement가 작동하도록 new webpack.HotModuleReplacement() 를 추가해줍니다. 또 html 파일 연결을 위해 new HtmlWebpackPlugin() 설정도 해주시면 됩니다. templete 은 실제로 우리가 작성한 html 파일의 경로를 써주시면 되고, filename 은 webpack이 bundling을 마치고 난 후의 html 파일 이름을 써주시면 됩니다. 서버와 브라우저가 실제로 사용하도록 원하는 이름을 써주시면 됩니다.

    Hot Module Replacement는 변경된 파일 부분만 반영하도록 하는 기능입니다. webpack은 클라이언트 코드를 하나로 bundling 해주는 역할로 시작했습니다. bundling은 여러개의 파일을 하나로 합치는 기능인데, 코드가 바뀔때마다 즉시 반영해주는 Live reloading 기능이 도입되었습니다. 하지만 글자가 1개만 바뀌어도 전체 코드를 다시 refresh해서 다소 불편함이 있었는데요, 불필요한 전체 새로고침을 막고 바뀐 부분만 빠르게 갈아치우는 (=hot 하게 module을 replace하는) 기능이 HMR 입니다.
```
- yarn add --dev @babel/core @babel/perset-env @babel/preset-react
- package.json에 scripts 추가
```
    "start": "webpack-dev-server --env=dev --profile --colors"
```
- yarn start 으로 확인
- yarn add react-router-dom react-helmet
- src/App.js, src/pages/Home.js, src/pages/News.js, src/components/Footer.js, src/component.Header.js 파일 생성 또는 수정

## env2 SSR
- yarn add express
- yarn add --dev webpack-dev-middleware webpack-hot-middleware webpack-node-externals
```
    express : 다들 아실거라고 믿습니다 :-)
    
    webpack-dev-middleware(WDM) : express로 만들어진 서버에서, 파일이 수정될 때마다 변경된 파일과 그 정보를 만들어주는 개발용 서버 도우미입니다.
    
    webpack-hot-middleware(WHM) : WDM에서 변경된 파일 정보를 생성하면, 그 파일들을 불러와서 브라우저에 갱신시킵니다. 이름처럼 WDS의 hot 기능을 담당한다고 보면 됩니다. 내부적으로는 EventSource를 써서 작동하는데 WebSocket과 유사한 통신방법입니다. SSR에서 HMR(hot module replacement)를 담당합니다.
    
    webpack-node-externals : 번들 파일에 불필요한 node_modules 를 빼주는 역할을 합니다. SSR은 js 파일이 클라이언트에게 전송되어 실행되기 전까지, 초기화면의 html string만 렌더링해 먼저 보여주는 개념입니다. 따라서 서버에서 렌더링된 파일에는 node_modules 이 필요 없게 되는것이지요.
```
- src/server.js 생성 및 작성
```
    renderToString : 리액트에서 지원하는 서버사이드 렌더링 메소드입니다. 클라이언트 사이드에서도 ReactDOM.render 대신 hydrate를 사용하는 것과 연관이 있는데 해당 코드에서 설명하겠습니다.

    helmet : 우리가 클라이언트 사이드에서 사용한 react-helmet의 정보를 가져오는 method 입니다. 꼭! renderToString 다음에 선언해주셔야 helmet의 정보를 정상적으로 가져올 수 있습니다. res.send 부분을 보시면 이번에는 title 정보를 주입해주고 있습니다. react-helemt은 head에 사용할 수 있는 대부분의 태그를 지원하니 필요하시면 공식 문서를 참고해 진행하시면 됩니다.

    StaticRouter : 서버사이드 렌더링에서 BrowserRouter 대신 사용하는 React-router 입니다. 접속 Url의 Router 정보를 클라이언트 사이드 파일에 전달해주는 역할을 합니다. location 에 req.url, context 에 object를 넣어 유저가 클라이언트의 BrowserRouter에게 전달해줍니다.

    res.send : body 태그에 앞에서 뽑아낸 html string을 주입해줍니다. 그리고 script tag로 bundle파일의 uri를 넣어주시면 됩니다. 아직은 Code-splitting을 하지 않았으므로 main.js 하나의 번들파일을 넣어주시면 됩니다.

    if (process.env.NODE_ENV !== 'production') 부분에는 WDM과 WHM 설정을 해줍니다. webpack.client.js 파일을 weppack 으로 실행시켜주면 컴파일러가 됩니다. express.static 처럼 request가 들어왔을 경우 파일을 보내주기 위해 app.use 해주시면 됩니다.
    
    webpack-dev-middleware : 첫 번째 파라미터로 compiler를, 두 번째 파라미터로 options를 설정해주실 수 있습니다. options의 다른 설정은 모두 optional 이지만 publicPath는 필수인데요. 보통 { publicPath: compiler.output.publicPath } 형태로 컴파일러의 설정을 그대로 씁니다.

    webpack-hot-middleware : WDM과 마찬가지로 두 번째 파라미터로 options를 전달할 수 있습니다. 저는 webpack.client.js 에서 query string 방식으로 설정하겠습니다.
    
    이제 서버사이드 렌더링을 위한 webpack 설정을 해보겠습니다. Typescript로 작성한 server.tsx 파일을 컴파일 해줄 webpack.server.js 파일을 먼저 작성해보겠습니다. Typescript 컴파일을 사용해도 되고, js로 작성해서 babel로 컴파일 해도되고, 컴파일이 필요없는 es5 등의 문법으로 작성하셔도 됩니다. 저는 webpack에서 지원하는 몇 가지 기능을 사용하고자 webpack으로 컴파일 합니다.
```
- webpack.server.js 생성 및 작성
```
    target : node.js 환경에서 돌아갈 파일을 컴파일할 때 쓰는 설정입니다. 보통 프론트엔드에서 쓰는 리액트같은 경우 브라우저에서 실행하기 때문에 target: web 환경에서 컴파일 됩니다. server.tsx 파일은 node.js의 express 서버를 실행하기 때문에 target 을 node로 바꿔주시면 됩니다.

    node : node.js의 property를 사용할지 말지에 대한 내용입니다. boolean 혹은 object 값을 할당하시면 되는데, false일 경우 모든 항목을 쓰지않는 것이고 object는 각각을 설정해주실 수 있습니다.
    false로 설정된 항목은 node.js가 아니라 webpack 규칙으로 처리하는데 __dirname이 대표적입니다. __dirname을 node.js가 처리할 경우 항상 ‘/’를 반환합니다. 저희는 webpack을 이용해 파일위치를 설정할 것이므로 false 혹은 { __dirname: false } 라고 해주시면 됩니다.

    entry : react 코드가 아닌 express 코드를 컴파일 하니까, src/server.tsx 의 위치를 입력해주세요.

    output : 저는 dist/ 폴더에 배포할 모든 파일을 모아놓을 것입니다. 다음에 나올 클라이언트 번들파일과 함께 server 파일 역시 dist 폴더에 컴파일 하겠습니다.

    externals : 앞서 말씀드린대로 서버에서 필요없는 node_modules 를 제외하기 위해 nodeExternals() 를 넣어주세요.
```
- webpack.client.js 생성 및 작성
```
    앞서 작성했던 webpack.dev.js 의 내용을 서버사이드 렌더링에 맞춰 바꿔보겠습니다. 파일 이름도 webpack.client.js 에 새로 작성해보겠습니다. 달라진 부분만 잠깐 보죠.

    entery : 새로운 녀석이 눈에 뜹니다. hotMiddlewareScript 인데요. 앞서 WDS는 HMR 기능을 쓰기 위해서 { hot: true } 만 입력해주면 자동으로 되던것과는 달리 webpack-hot-middleware 에서는 약간의 설정이 더 필요합니다. const로 선언한 hotMiddlewareScript 를 넣어줍니다. 꼭 const로 선언할 필요 없이 직접 입력하셔도 됩니다.
    뒤에 query string으로 입력한 옵션값들은 server.tsx 에서 할당해줄 수도 있습니다. 그럴경우 webpack-hot-middleware/client 까지만 입력해주시면 됩니다. 자세한 방법은 webpack-hot-middleware repo를 참고해주세요.

    output : 마찬가지로 dist/ 폴더에 번들링을 하겠습니다.

    devServer : express, dev-server, HMR 기능을 한번에 해결해주던 webapck-dev-server 를 각각의 패키지를 써서 대체하겠습니다. 앞서 말씀드린대로 서버사이드 렌더링에서 WDS의 지원이 제한적이기 때문입니다. webpack config에서는 삭제해주시면 됩니다.
```

## env3 (Code-splitting)
- yarn add @loadable/component @loadable/server
- yarn add --dev @loadable/babel-plugin @loadable/webpack-plugin