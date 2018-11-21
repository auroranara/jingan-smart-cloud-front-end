export function getCounter(count, limit, startTime, serverTime, callback) {
  const endTime = startTime + limit * 1000;
  const currentTime = serverTime + count * 1000;

  // 还未从服务器获取考试开始时间和服务器时间
  if (!startTime || !serverTime)
    return '00:00';

  // 倒计时结束时，调用回调函数
  if (currentTime > endTime) {
    callback && callback();
    return '00:00';
  }

  const rest = Math.floor((endTime - currentTime) / 1000);
  // console.log(endTime, currentTime);
  return `${fillZero(Math.floor(rest / 60))}:${fillZero(rest % 60)}`;
}

function fillZero(n) {
  return n > 9 ? n : `0${n}`;
}

function addType(obj) {
  return Object.entries(obj).reduce((prev, next) => {
    let [k, v] = next;
    v = Array.isArray(v) ? v : [];
    prev[k] = v.map(item => ({ ...item, type: k }));
    return prev;
  }, {});
}

export function concatAll(obj, keys) {
  const newObj = addType(obj);
  return keys.reduce((prev, next) => {
    return prev.concat(newObj[next]);
  }, []);
}
