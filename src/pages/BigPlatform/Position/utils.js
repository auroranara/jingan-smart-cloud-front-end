import moment from 'moment';

import { personIcon } from './imgs/urls';

export function handlePositions(positions=[], wsData=[]) {
  if (!wsData || !wsData.length)
    return positions;

  const ids = wsData.map(({ cardId }) => cardId);
  // 筛选出不包含在websocket推送中且在线的卡，然后再加上推送的含有新状态的卡，即为新的人员位置及状态列表
  const pos = positions.filter(({ cardId, onlineStatus }) => !ids.includes(cardId) && Number.parseInt(onlineStatus, 10));
  return [...pos, ...wsData];
}

export function handleInitialInfo(positions) {
  const pos = positions.map(({ cardId, userName, uptime }) => ({ id: cardId, name: userName, time: uptime, desc: '进入房间' }));
  pos.reverse();
  return pos;
}

export function handlePosInfo(info, wsData=[]) {
  if (!wsData || !wsData.length)
    return info;

  const moreInfo = wsData.filter(({ areaChanged }) => areaChanged).map(({ cardId, userName, uptime, areaChangedDesc }) => ({ id: cardId, name: userName, time: uptime, desc: areaChangedDesc }));
  moreInfo.reverse();
  return [...moreInfo, ...info];
}

export function getAlarmList(alarmList, wsData, prop, callback) {
  if (!Array.isArray(wsData) || !wsData.length)
    return [];

  const cardIds = alarmList.map(({ cardId }) => cardId);
  // 对应cardId的警报已经收录过了，则不再重复收录
  const newAlarms = wsData.filter(item => item[prop]).filter(({ cardId }) => !cardIds.includes(cardId));
  if (newAlarms.length)
    callback(newAlarms[0]);
  return [...alarmList, ...newAlarms];
};

export function getPersonInfoItem(cardId, list) {
  return list.find(item => item.cardId === cardId);
}

export function getOverstepItem(cardId, list) {
  return list.find(item => item.cardId === cardId);
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
  if (alarm)
    return alarm.areaId;
  return '';
}

// 生成新的树
export function genTreeList(list, callback, deep=0) {
  return list.map(item => {
    const { children, ...restProps } =  item;
    const newItem = callback(restProps);
    newItem.indentLevel = deep;
    if (children && children.length)
      newItem.children = genTreeList(children, callback, deep + 1);
    return newItem;
  });
}

// export function handleSectionTree(list) {
//   traverse(list, (item, deep) => {
//     const { name, cardCount, lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus } = item;
//     item.name = name;
//     item.count = cardCount;
//     item.status = lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 0 : 1;
//     item.indentLevel = deep;
//   });
// }

export function getSectionTree(list) {
  return genTreeList(list, item => {
    const { id, name, cardCount, lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus, mapPhoto, range, ...restProps } = item;
    return {
      id,
      name,
      mapPhoto,
      range,
      ...restProps,
      count: cardCount,
      status: lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 0 : 1,
    };
  });
}

// 相同的beconId人员聚合到一个数组中
export function genAggregation(list) {
  if (!Array.isArray(list))
    return [];

  const beconIds = [];
  return list.reduce((prev, next) => {
    const { beconId } = next;
    const index = beconIds.indexOf(beconId);
    if (index === -1) {
      beconIds.push(beconId);
      prev.push([next]);
    }
    else
      prev[index].push(next);
    return prev;
  }, []);
}

export function findInTree(targetValue, list, prop='id') {
  if (!Array.isArray(list))
    return;

  let targetItem = list.find(item => item[prop] === targetValue);
  if (!targetItem)
    for (const { children } of list) {
      targetItem = findInTree(targetValue, children, prop);
      if (targetItem)
        break;
    }

  return targetItem;
}

export function parseImage(section) {
  let { id, mapPhoto, range } = section;
  range = range || '{}';
  return { id, url: JSON.parse(mapPhoto).url, ...JSON.parse(range) };
}

export function getAreaChangeMap(list) {
  return list.reduce((prev, next) => {
    const { areaId, type } = next;
    // 1 进入 2 离开
    const delta = +type === 1 ? 1 : -1;
    if (prev[areaId])
      prev[areaId] += delta;
    else
      prev[areaId] = 0;
    return prev;
  }, {});
}

function getChildIds(tree, cache) {
  const { id, children } = tree;
  let childIds = cache[id];

  if (!children || !children.length)
    return [];

  if (childIds)
    return childIds;

  childIds = children.reduce((prev, next) => {
    const { id } = next;
    // console.log(id, next);
    prev.push(id);
    return prev.concat(getChildIds(next, cache).filter(id => id));
  }, []);
  cache[id] = childIds;
  return childIds;
}

function traverse(list, callback, parentId=null) {
  list.forEach(item => {
    const { id, children } = item;
    callback(item, parentId);
    if (Array.isArray(children))
      traverse(children, callback, id);
  });
}

// 本身用的单位平面图，但是子节点用的是楼层图，则为多层建筑物，此处简化处理，认为平面图就一张，mapId相同的为单位平面图，不同的为楼层平面图
function isBuilding(mapId, childMapId, companyMapId) {
  const isCompanyMap = mapId === companyMapId;
  const isFirstChildFloor = childMapId !== companyMapId;
  if (isCompanyMap && isFirstChildFloor)
    return true;
  return false;
}

// 将区域树打平成一个Map对象，areaId => { name, parent, childIds }
export function getAreaInfo(list) {
  const cache = {};
  const areaInfo = {};
  traverse(list, (item, parentId) => {
    const { id, name, companyMap, mapId, children } = item;
    const first = children && children.length ? children[0] : {};
    areaInfo[id] = {
      id,
      name,
      parentId,
      isBuilding: isBuilding(mapId, first.mapId, companyMap),
      childIds : getChildIds(item, cache),
    };
  });

  return areaInfo;
}
