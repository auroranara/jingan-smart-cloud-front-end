import moment from 'moment';

export const OPTIONS_RED = '#FF0019';
export const OPTIONS_BLUE = '#0FF';

export function handlePositions(positions = [], wsData = []) {
  if (!wsData || !wsData.length) return positions;

  const ids = wsData.map(({ cardId }) => cardId);
  // 筛选出不包含在websocket推送中且在线的卡，然后再加上推送的含有新状态的卡，即为新的人员位置及状态列表
  const pos = positions.filter(
    ({ cardId, onlineStatus }) => !ids.includes(cardId) && Number.parseInt(onlineStatus, 10)
  );
  return [...pos, ...wsData];
}

export function handleInitialInfo(positions) {
  const pos = positions.map(({ cardId, userName, uptime }) => ({
    id: cardId,
    name: userName,
    time: uptime,
    desc: '进入房间',
  }));
  pos.reverse();
  return pos;
}

export function handlePosInfo(info, wsData = []) {
  if (!wsData || !wsData.length) return info;

  const moreInfo = wsData
    .filter(({ areaChanged }) => areaChanged)
    .map(({ cardId, userName, uptime, areaChangedDesc }) => ({
      id: cardId,
      name: userName,
      time: uptime,
      desc: areaChangedDesc,
    }));
  moreInfo.reverse();
  return [...moreInfo, ...info];
}

export function getAlarmList(alarmList, wsData, prop, callback) {
  if (!Array.isArray(wsData) || !wsData.length) return [];

  const cardIds = alarmList.map(({ cardId }) => cardId);
  // 对应cardId的警报已经收录过了，则不再重复收录
  const newAlarms = wsData
    .filter(item => item[prop])
    .filter(({ cardId }) => !cardIds.includes(cardId));
  if (newAlarms.length) callback(newAlarms[0]);
  return [...alarmList, ...newAlarms];
}

export function getPersonInfoItem(cardId, list) {
  return list.find(item => item.cardId === cardId) || {};
}

export function getAlarmItem(alarmId, list) {
  return list.find(({ id }) => id === alarmId) || {};
}

export function getAlarmCards(list) {
  const cards = list.map(({ cardId, uptime, sos, overstep, areaName }) => ({
    cardId,
    id: `${cardId}-${uptime}`,
    type: sos ? 2 : 1,
    info: areaName,
    time: moment(uptime).format('YYYY-MM-DD HH:mm:ss'),
    status: 1,
  }));

  cards.sort((c, c1) => c1.uptime - c.uptime);
  return cards;
}

export function getAreaId(wsData) {
  const alarm = wsData.find(({ sos, overstep }) => sos || overstep);
  if (alarm) return alarm.areaId;
  return '';
}

const ALARM = 2;
// 生成新的树
export function genTreeList(list, callback, deep = 0, parent = null) {
  return list.map(item => {
    const { children, ...restProps } = item;
    const newItem = callback(restProps);
    newItem.indentLevel = deep;
    newItem.parent = parent;
    newItem.range.options.color = newItem.status === ALARM ? OPTIONS_RED : OPTIONS_BLUE;
    if (children && children.length)
      newItem.children = genTreeList(children, callback, deep + 1, newItem);
    return newItem;
  });
}

// export function handleSectionTree(list) {
//   traverse(list, (item, deep) => {
//     const { name, cardCount, lackStatus, outstripStatus, overstepStatus, tLongStatus } = item;
//     item.name = name;
//     item.count = cardCount;
//     item.status = lackStatus || outstripStatus || overstepStatus || tLongStatus ? 0 : 1;
//     item.indentLevel = deep;
//   });
// }

export function getSectionTree(list) {
  return genTreeList(list, item => {
    const {
      id,
      name,
      cardCount,
      lackStatus,
      outstripStatus,
      overstepStatus,
      tlongStatus,
      mapPhoto,
      range,
      ...restProps
    } = item;
    const status = lackStatus || outstripStatus || overstepStatus || tlongStatus ? 2 : 1;
    const parsedRange = JSON.parse(range);
    // parsedRange.options.fill = false; // 无法点击
    parsedRange.options.fillOpacity = 0;
    parsedRange.options.weight = 3;
    return {
      id,
      name,
      mapPhoto: JSON.parse(mapPhoto),
      range: parsedRange,
      ...restProps,
      count: cardCount,
      status,
    };
  });
}

// 相同的beaconId人员聚合到一个数组中
export function genAggregation(list) {
  if (!Array.isArray(list)) return [];

  const beaconIds = [];
  return list.reduce((prev, next) => {
    const { beaconId } = next;
    const index = beaconIds.indexOf(beaconId);
    if (index === -1) {
      beaconIds.push(beaconId);
      prev.push([next]);
    } else prev[index].push(next);
    return prev;
  }, []);
}

export function findInTree(targetValue, list, prop = 'id') {
  if (!Array.isArray(list)) return;

  let targetItem = list.find(item => item[prop] === targetValue);
  if (!targetItem)
    for (const { children } of list) {
      targetItem = findInTree(targetValue, children, prop);
      if (targetItem) break;
    }

  return targetItem;
}

export function parseImage(section) {
  let { id, mapPhoto, range } = section;
  range = range || {};
  return { id, url: mapPhoto.url, ...range };
}

export function getAreaChangeMap(list) {
  return list.reduce((prev, next) => {
    const { areaId, type } = next;
    // 1 进入 2 离开
    // const delta = +type === 1 ? 1 : -1;
    const isEnter = +type === 1;
    if (prev[areaId]) {
      if (isEnter) prev[areaId].enterDelta += 1;
      else prev[areaId].exitDelta += 1;
    } else {
      if (isEnter) prev[areaId] = { enterDelta: 1, exitDelta: 0 };
      else prev[areaId] = { enterDelta: 0, exitDelta: 1 };
    }
    return prev;
  }, {});
}

function getChildIds(tree, cache) {
  const { id, children } = tree;
  let childIds = cache[id];

  if (!children || !children.length) return [];

  if (childIds) return childIds;

  childIds = children.reduce((prev, next) => {
    const { id } = next;
    // console.log(id, next);
    prev.push(id);
    return prev.concat(getChildIds(next, cache).filter(id => id));
  }, []);
  cache[id] = childIds;
  return childIds;
}

// function traverse(list, callback, parentId=null) {
//   list.forEach(item => {
//     const { id, children } = item;
//     callback(item, parentId);
//     if (Array.isArray(children))
//       traverse(children, callback, id);
//   });
// }

function traverse(list, callback, parents = []) {
  list.forEach(item => {
    const { children } = item;
    callback(item, parents);
    if (Array.isArray(children)) {
      const nextParents = [...parents, item];
      traverse(children, callback, nextParents);
    }
  });
}

// 本身用的单位平面图，但是子节点用的是楼层图，则为多层建筑物，此处简化处理，认为平面图就一张，mapId相同的为单位平面图，不同的为楼层平面图
function isBuilding(mapId, childMapId, companyMapId) {
  // 没有子节点则肯定为最底层的，必然为区域
  if (!childMapId) return false;
  const isCompanyMap = mapId === companyMapId;
  const isFirstChildFloor = childMapId !== companyMapId;
  if (isCompanyMap && isFirstChildFloor) return true;
  return false;
}

// 将区域树打平成一个Map对象，areaId => { name, parent, childIds }
// export function getAreaInfo(list) {
//   const cache = {};
//   const areaInfo = {};
//   traverse(list, (item, parentId) => {
//     const { id, name, companyMap, mapId, children } = item;
//     const first = children && children.length ? children[0] : {};
//     areaInfo[id] = {
//       id,
//       name,
//       parentId,
//       isBuilding: isBuilding(mapId, first.mapId, companyMap),
//       childIds : getChildIds(item, cache),
//     };
//   });

//   return areaInfo;
// }

export function getAreaInfo(list) {
  const cache = {};
  const areaInfo = {};
  traverse(list, (item, parents) => {
    const { id, name, companyMap, mapId, children } = item;
    const length = parents.length;
    const parent = length ? parents[length - 1] : {};
    const firstChild = children && children.length ? children[0] : {};
    const nodeList = [...parents, item]; // 从父节点到当前节点走过的路径的所有节点的数组
    areaInfo[id] = {
      id,
      name,
      fullName: nodeList.map(({ name }) => name).join('-'),
      parentId: parent.id || null,
      isBuilding: isBuilding(mapId, firstChild.mapId, companyMap),
      childIds: getChildIds(item, cache),
      images: getMapImages(nodeList),
    };
  });

  // areaId === null时，在厂区外
  areaInfo[null] = areaInfo[undefined] = {
    id: 'null',
    name: '外围区域',
    fullName: '外围区域',
    isBuilding: false,
  };

  return areaInfo;
}

// 生成从顶层到当前节点的所有不同mapId的图
function getMapImages(list) {
  // console.log(list);
  const { companyMap } = list[0];
  // const current = list[list.length - 1];
  const [images, lastMapId] = list.reduce(
    (prev, next) => {
      const { mapId } = next;
      if (mapId !== prev[1]) prev[0].push(parseImage(next));
      prev[1] = mapId;
      return prev;
    },
    [[], companyMap]
  );

  return images;
}

function getTimeDesc(t) {
  const ms = +t;
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  return `${hours ? `${hours}小时` : ''}${minutes ? `${minutes}分钟` : ''}`;
}

export function getAlarmDesc(item, areaInfo) {
  const { areaId, type, typeName, cardCode, warningTime, tLongTime } = item;

  const time = moment(warningTime).format('HH:mm');
  const title = `【${typeName}】 ${time}`;

  let desc = '';
  const name = `${getUserName(item, true)}(${cardCode})`;
  const areaName = areaInfo[areaId] ? areaInfo[areaId].fullName : '外围区域';

  // 1 sos 2 越界  3 长时间逗留 4 超员 5 缺员
  switch (+type) {
    case 1:
      desc = `${name}在${areaName}发起求救信号`;
      break;
    case 2:
      desc = `${name}进入${areaName}`;
      break;
    case 3:
      desc = `${name}在${areaName}长时间停留${getTimeDesc(tLongTime)}`;
      break;
    case 4:
      desc = `${areaName} 区域超员`;
      break;
    case 5:
      desc = `${areaName} 区域缺员`;
      break;
    default:
      desc = '暂无信息';
  }

  return [title, desc];
}

// cardType 0 正常 1 访客
export function getUserName(item, showPrefix) {
  const { cardType, userName, visitorName } = item;
  const isVisitor = !!+cardType;

  if (!isVisitor)
    return userName || '未领';
  if (showPrefix && visitorName)
    return `访客-${visitorName}`;
  if (!showPrefix && visitorName)
    return visitorName;
  return '访客';
}

// 0 区域 1 视频 2 人
export function getMapClickedType(id) {
  if (!id) return 0;
  if (id.includes('_@@video')) return 1;
  return 2;
}

const PERSON_ALARM_TYPES = ['SOS', '越界', '长时间逗留'];
export function getPersonAlarmTypes(ps) {
  const types = [0, 0, 0];
  for (const p of ps) {
    ['sos', 'overstep', 'tlong'].forEach((prop, i) => {
      if (p[prop]) types[i] = 1;
    });
    if (types.every(n => n)) break;
  }

  return types
    .map((n, i) => (n ? PERSON_ALARM_TYPES[i] : ''))
    .filter(s => s)
    .join(',');
}

export function getIconClassName(isSingle, isVisitor, isOnline, isAlarm) {
  let suffix = isAlarm ? 'Red' : '';
  // 多人报警
  if (!isSingle) return `people${suffix}`;

  suffix = isOnline ? (isAlarm ? 'Red' : '') : 'Off';
  // 其余均为单人情况
  // 单人 && 访客
  if (isVisitor) return `visitor${suffix}`;
  return `person${suffix}`;
}

export function isCompanyMap(current) {
  if (!current || !Object.keys(current).length)
    return;


  let { mapId, companyMap, parent } = current;
  // mapId不存在时，找到离其最近的父元素的mapId
  while(!mapId && parent) {
    mapId = parent.mapId;
    parent = parent.parent;
  }

  return mapId === companyMap;
}

const INTERVAL = 1000;
export function animate(posInfo, move, callback) {
  const { id, origin, target } = posInfo;
  const { x, y } = origin;
  const { x1, y1 } = target;
  const deltaX = x1 - x;
  const deltaY = y1 - y;
  let start = null;
  function step(timestamp) {
    if (!start)
      start = timestamp;
    const progress = timestamp - start;
    if (progress < INTERVAL) {
      const percent = progress / INTERVAL;
      move(id, origin + deltaX * percent, progress + deltaY * percent);
      window.requestAnimationFrame(step);
    }
    else
      callback(id);
  }

  window.requestAnimationFrame(step);
}
