const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  
  /**
   * webpack4 의 신기능
   * development, production
   * production 이면 배포용 최적화가 자동 진행
   */
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  /**
   * 파일을 컴파일 환경 지정
   * express 는 node 이므로 node 설정, Frontend 의 경우 web 설정
   */
  target: 'node',

  /**
   * node의 property 사용여부
   * fasle 로 설정시 node가 아니라 webpack 의 규칙으로 처리
   * webpack 을 이용해 파일 위치를 설정할 것이므로 false 또는 {__dirname: false} 로 지정함
   */
  node: false, // it enables '__dirname' in files. If is not, '__dirname' always return '/'.

  /**
   * 시작지점 경로
   * {key: value} 일때는 결과물이 key의 이름으로 지정
   */
  entry: {
    server: './src/server.js',
  },

  /**
   * 출력 결과물
   * filename : 결과물 파일 이름
   * path : 결과물 저장 경로 (WDS 에서는 메모리에서 동작하므로 path 가 의미 없음)
   */
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
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
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      /**
       * image는 file-loader 을 사용한다.
       * publicPath를 web으로 고정한 이유는 SSR 시 node -> web 으로 path가 변경되어 react 에서 경고
       */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: `/assets/web/`,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      /**
       * css, scss 설정
       * style-loader 을 사용하면 <style>...</style> 안으로 들어가기 때문에 HMR 가능
       * MiniCssExtractPlugin 을 사용하면 css 로 생성
       */
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ],
  },

  /**
   * webpack 가 알아서 경로나 확장자를 처리할 수 있게 도와주는 옵션
   */
  resolve: {
    extensions: ['.js', 'jsx'],
  },

  /**
   * webpack에서 제외할 것들 정의
   * 번들링 시점에 번들파일에 해당 것들이 포함되지 않도록 하며, libraryTarget 옵션에 설정된 모듈 포르 방식으로 변환
   */
  externals: [nodeExternals()],

  /**
     * moduleIds : 'hsahed' : 캐시 사용으로 빠르게 처리
     */
    optimization: {
      moduleIds: 'hashed'
  },

  plugins: [
    new MiniCssExtractPlugin({filename: 'style.css'})
  ]
  
};