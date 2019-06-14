function rand(n, m) {
  return Math.floor(Math.random() * (m - n)) + n;
}

function isOverHalf(n = 0.5) {
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
      const  { count, normal, confirmWarning, earlyWarning, unconnect, list } = deviceCount;
      counts = { common: normal, alarm: confirmWarning, warn: earlyWarning, noAccess: unconnect, equipment: count, deviceList: list };
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
    if (compare) return compare;
    return item.name.localeCompare(item1.name, 'zh-Hans-CN', { sensitivity: 'accent' });
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

// 获取监测信息弹框中的报警标签序号数组
export function getAlerted(list, labels) {
  const statusMap = list.reduce((prev, next) => {
    const { desc, status } = next;
    prev[desc] = +status;
    return prev;
  }, {});

  return labels.reduce((prev, next, i) => {
    if (next.some(label => statusMap[label] === 1 || statusMap[label] === 2))
      prev.push(i);
    return prev;
  }, []);
}

// 根据paramCode获取对应的报警参数序号，否则获取报警的第一个参数的序号
export function getTargetAlerted(list, labels, paramName) {
  if (paramName) {
    const index = labels.findIndex(item => item.includes(paramName));
    return index === -1 ? undefined : index;
  }

  const alerted = getAlerted(list, labels);
  return alerted.length ? alerted[0] : undefined;
}

const STATUS_MAP = [0, 2, 1, -1];
// 获取设备列表中状态对应的第一个设备id
export function getFirstDeviceId(list=[], index=0) {
  const target = list.find(({ status }) => +status === STATUS_MAP[index]);
  return target ? target.deviceId : undefined;
}

export function getLineColor(limit, isOutOfContact, end, colors) {
  const axisLineColor = [];
  const [value1, value2] = limit;
  if (isOutOfContact) {
    axisLineColor.push([1, '#ccc']);
  }
  else {
    if (value1 !== null) {
      axisLineColor.push([ value1/end, colors[0] ]);
      if (value2 !== null) {
        axisLineColor.push([ value2/end, colors[1] ]);
        axisLineColor.push([ 1, colors[2] ]);
      }
      else {
        axisLineColor.push([ 1, colors[1] ]);
      }
    }
    else {
      if (value2 !== null) {
        axisLineColor.push([ value2/end, colors[0] ]);
        axisLineColor.push([ 1, colors[2] ]);
      }
      else {
        axisLineColor.push([ 1, colors[0] ]);
      }
    }
  }
}


const GREEN = '#37a460';
const ORANGE = '#f9b206';
const RED = '#ff4905';
const COLORS = [RED, ORANGE, GREEN, ORANGE, RED];
export function getLineColor1(limit, isOutOfContact, end) {
  if (isOutOfContact)
    return [[1, '#ccc']];

  const [[warn1, warn2], [alarm1, alarm2]] = limit;
  const splits = [alarm1, warn1, warn2, alarm2].map(n => n ? n / end : null);
  const nums = splits.filter(n => n);
  nums.push(1); // 末尾添加1
  const colors = COLORS.map((c, i) => {
    if (i === 2) // 绿色必然存在
      return c;
    return splits[i > 2 ? i - 1 : i] ? c : null; // 剔除warn,alarm上下限不存在时对应的颜色
  }).filter(c => c);
  const axisLineColor = nums.map((n, i) => [n, colors[i]]);
  return axisLineColor;
}

// condition 1(< 上限) 2(> 下限) [上限, 下限] => 2->0 1->1
export function getLimit(deviceConfig, code) {
  const limit = [[], []];
  deviceConfig.forEach(({ code: code2, level, condition, limitValue }) => {
    if (code2 === code) {
      limit[level - 1][+condition % 2] = (+limitValue);
    }
  });
  return limit;
}
