
/**
 * webpack 에서 설정 target 을 인식
 * @param {*} caller 
 */
function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web');
}


module.exports = api => {
  const web = api.caller(isWebTarget);  //web, node

  return {
    presets: [
      '@babel/preset-react',
      [
        /**
           * useBuiltIns 는 babel polyfill 설정 
           *   'entry' 로 설정시 @core-js 모듈로 import 처리
           * targets는 node 일때는 {node: 'current'} 설정은 현재 node 버전에 맞게 최적화
           *  web의 경우 더 많은 브라우저를 대응해야 할 때는 undefined 대신 browserlist 방식으로 ie 대응
           */
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          targets: !web ? { node: 'current' } : undefined,
        },
      ],
    ],
    /**
     * loadable code splitting 인식하기 위한 babel plugin 추가
     */
    plugins: ['@loadable/babel-plugin'],
  };
};