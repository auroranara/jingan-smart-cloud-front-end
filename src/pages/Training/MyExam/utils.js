export function getCounter(restTime, callback) {
  // 还未从服务器获取考试开始时间和服务器时间
  if (!restTime)
    return '00:00';

  // 倒计时结束时，调用回调函数
  if (restTime <= 0) {
    callback && callback();
    return '00:00';
  }

  // console.log(endTime, currentTime);
  return `${fillZero(Math.floor(restTime / 60000))}:${fillZero(Math.floor((restTime % 60000) / 1000))}`;
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
    const arr = newObj[next];
    return prev.concat(Array.isArray(arr) ? arr : []);
  }, []);
}

export function isRight(origin, target) {
  if (origin.length !== target.length)
    return false;

  for (let i = 0; i < origin.length; i++)
    if (origin[i] !== target[i])
      return false;

  return true;
}
