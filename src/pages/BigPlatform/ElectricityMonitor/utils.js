function rand(n, m) {
  return Math.floor(Math.random() * (m - n)) + n;
}

function isOverHalf(n=0.5) {
  return Math.random() > n;
}

function getRandNum() {
  return isOverHalf() ? 0 : rand(1, 10);
}

// export function genCardsInfo(list=[]) {
//   return list.map(({ companyId, companyName, address, aqy1Name, aqy1Phone }) => {
//     const [common, alarm, warn, noAccess] = [...Array(4).keys()].map(i => getRandNum());
//     return {
//       companyId,
//       name: companyName,
//       address: address,
//       safetyMan: aqy1Name,
//       safetyPhone: aqy1Phone,
//       common,
//       alarm,
//       warn,
//       noAccess,
//       equipment: isOverHalf(0.15) ? common + alarm + warn + noAccess : 0,
//     };
//   });
// }

export function genCardsInfo(connectedList=[], allCompanyList=[]) {
  const connectedCompanyIds = connectedList.map(({ companyId }) => companyId);
  const unconnectedList = allCompanyList.filter(({ companyId }) => !connectedCompanyIds.includes(companyId));
  return [...connectedList, ...unconnectedList].map(({ companyId, companyName, address, aqy1Name, aqy1Phone, deviceCount }) => {
    let counts = { equipment: 0 };
    if (deviceCount) {
      const  { count, normal, confirmWarning, earlyWarning, unconnect } = deviceCount;
      counts = { common: normal, alarm: confirmWarning, warn: earlyWarning, noAccess: unconnect, equipment: count };
    }

    return {
      companyId,
      name: companyName,
      address: address,
      safetyMan: aqy1Name,
      safetyPhone: aqy1Phone,
      ...counts,
    };
  });
}

export function sortCardList(list) {
  const newList = Array.from(list);
  newList.sort((item, item1) => {
    const compare = item1.equipment - item.equipment;
    if (compare)
      return compare;
    return item.name.localeCompare(item1.name, 'zh-Hans-CN', {sensitivity: 'accent'}
    );
  });

  return newList;
}

export function sortList(list, prop) {
  list.sort((item, item1) => {
    return item1[prop] - item[prop];
  });
}

const UNIT_SETS = ['alarmUnit', 'earlyWarningUnit', 'normalUnit'];

export function getAlarmUnits(unitSet) {
  const uSet = unitSet || {};
  return UNIT_SETS.reduce((prev, next) => {
    prev[next] = Array.isArray(uSet[next]) ? uSet[next].length : 0;
    return prev;
  }, {});
}

// 将传入图标的数组的横坐标值太长的情况做处理，当大于等于3个项目时，最后一个横坐标的名字大于10个字符时，超出的用省略号替代
export function handleChartLabel(list) {
  const length = list.length;
  return list.map((item, i) => {
    const name = item.name;
    return {
      ...item,
      name: length > 2 && i === length - 1 && name.length > 10 ? `${name.slice(0, 10)}...` : name,
    };
  });
}

// 作用同上述函数，只是返回值为单独的标签列表
export function getChartLabels(list) {
  const length = list.length;
  return list.map((item, i) => {
    const name = item.name;
    return length > 2 && i === length - 1 && name.length > 10 ? `${name.slice(0, 10)}...` : name;
  });
}