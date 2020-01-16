const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  
  /**
   * webpack4 의 신기능
   * development, production
   * production 이면 배포용 최적화가 자동 진행
   */
  mode: 'development',
  
  /**
  * 시작지점 경로
  * entry: './src/index.js',
  * __dirname : 프로젝트의 절대경로
  * 
  */
  entry: path.join(__dirname, 'src/index.js'),

  /**
   * 출력 결과물
   * filename : 결과물 파일 이름
   * path : 결과물 저장 경로 (WDS 에서는 메모리에서 동작하므로 path 가 의미 없음)
   */
  output: {
    filename: 'bundle.js',
    // path: path.join(__dirname, 'dist')
  },
  
  /**
  * 속성           |   desc                         |   cli
  * host          | 사용될 호스트 지정                 | webpack-dev-server-host 127.0.0.1
  * contentBase   | 컨텐트 제공 경로지정(정적파일)       | webpace-dev-server-content-base /path/to/content/dir
  * compress      | 모든 항목에 zgip                 | webpack-dev-server-compress
  * hot           | HMR 활성화                      | N/A
  * inline        | inline 모드 활성화               | webpac-dev-server-inline=true
  * port          | 접속 포트 설정                    | webpack-dev-server-port 3000
  * open          | dev server 구동 후 브라우져 열기   | webpack-dev-server --open
  */
  devServer: {
    historyApiFallback: true,
    inline: true,
    port: 3000,
    hot: true,
    publicPath: '/',
    open: true
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
        use: ['babel-loader']
      },
    ],
  },

  /**
   * webpack 가 알아서 경로나 확장자를 처리할 수 있게 도와주는 옵션
   */
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  /**
   * 플러그인 설정
   * HtmlWebpackPlugin : template 의 html 파일을 사용하여 filename 에 지정된 파일로 변환 및 생성된 main.js 를 자동 import
   * webpack.HotModuleReplacementPlugin : 소스 변화 감지를 하여 자동 반영
   */
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'public/index_dev.html'),
    }),
  ],
}