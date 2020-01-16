const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');

/**
 * web의 경우 HMR 사용하기 위한 스크립트 생성
 */
const hotMiddlewareScript = `webpack-hot-middleware/client?name=web&path=/__webpack_hmr&timeout=20000&reload=true`;

/**
 * entry :시작지점의 분기 처리 function
 * @param {*} target : node | web 의 값을 처리
 * node이면  App.js 부터, web 이면 index.js 부터 처리
 * node 일땐 server.js 에서 index.js 의 내용을 처리해 주니 App.js 부터
 */
const getEntryPoint = (target) => {
  if (target === 'node') {
    return ['./src/App.js'];
  } else {
    return [hotMiddlewareScript, './src/index.js'];
  }
}

/**
 * 설정 파일 반환
 * @param {*} target : node | web 의 값을 처리
 */
const getConfig = (target) => ({
  
  /**
   * webpack4 의 신기능
   * development, production
   * production 이면 배포용 최적화가 자동 진행
   */
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  /**
   * 컴파일된 파일에 붙여줄 이름 지정
   * web, node
   */
  name: target,

  /**
   * target 지정
   * target, = tatget: target,
   * client 이지만 node도 지정된 이유는 express > server.js 에서 사용할 파일 이기 때문에 
   */
  target,

  /**
   * 시작 지점
   */
  entry: getEntryPoint(target),

  /**
   * SSR, CSR 구분하여 결과 저장 경로 변경
   * libraryTarget 의 경우 node는 commonjs 를 사용하기에 commonjs2 지정, web은 undefined 처리
   * cache 전략으로 js 파일은 hash 값을 가지도록 처리 : dev = hash, prod = chunkhash
   * finename에 [chunkhash] 설정하면 오류 남 chunkFilename 으로 처리 하게 수정
   */
  output: {
    path: path.resolve(__dirname, `dist/${target}`),
    // filename: '[name].js',
    chunkFilename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].[hash].js',
    publicPath: `/assets/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },

  /**
   * 로더
   * test, use 로 구성된 객체로 설정
   * test 에 로딩할 파일 지정
   * use에 적용할 로더 지정
   * CSS, SCSS 등 여기에 추가해야 함
   */
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
      },
    ],
  },

  /**
   * webpack 가 알아서 경로나 확장자를 처리할 수 있게 도와주는 옵션
   */
  resolve: {
    extensions: ['.js', 'jsx'],
  },

  /**
   * 플러그인 설정
   * LoadablePlugin : SSR의 code splitting 플러그인 @loadable/webpack-plugin
   * webpack.HotModuleReplacementPlugin : 소스 변화 감지를 하여 자동 반영
   */
  plugins: (
    target === 'web' ? 
      [new LoadablePlugin(), new webpack.HotModuleReplacementPlugin()] 
      : [new LoadablePlugin()]
  ),

  /**
   * webpack에서 제외할 것들 정의
   * 번들링 시점에 번들파일에 해당 것들이 포함되지 않도록 하며, libraryTarget 옵션에 설정된 모듈 포르 방식으로 변환
   * node에서만 사용하며 web 일때는 undefined 처리
   */
  externals: (
    target === 'node' ? 
      ['@loadable/component', nodeExternals()] 
      : undefined
  ),
});

/**
 * web 과 node 하나의 config 로 번들링
 */
module.exports = [getConfig('web'), getConfig('node')];