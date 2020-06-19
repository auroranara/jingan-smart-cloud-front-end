// const IP = '58.215.224.86:8085';
const BUILD_ID = '201060';
// const SECRET = '8691844ea20d4ceeaa3d000ebc3a5ba1';
const APP_ID = 'client';

function getMoreParam(type, param) {
  switch(type) {
    case 'trackSn':
      return `&trackSn=${param || ''}`;
    // case 'behaviorAnalysis':
    //   return '&name=';
    default:
      return '';
  }
}
export function getSrc(type, ip, buildId, secret, appId, param) {
  return `http://${ip}/js/tunnel.html?to=${type}&buildId=${buildId || BUILD_ID}&appid=${appId || APP_ID}&secret=${secret}&wh=false${getMoreParam(type, param)}`;
  // return `http://chem2.joysuch.com/js/tunnel.html?to=${type}&buildId=200647&wh=false&appid=yanshi&secret=4011a04a6615406a9bbe84fcf30533de`;
}
