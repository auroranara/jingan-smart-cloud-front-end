const IP = '58.215.224.86:8085';
const BUILD_ID = '201060';
const SECRET = '8691844ea20d4ceeaa3d000ebc3a5ba1';
const APP_ID = 'client';

export function getSrc(type, ip, buildId, secret, appId) {
  return `http://${ip || IP}/js/tunnel.html?to=${type}&buildId=${buildId || BUILD_ID}&appid=${appId || APP_ID}&secret=${secret || SECRET}`;
}
