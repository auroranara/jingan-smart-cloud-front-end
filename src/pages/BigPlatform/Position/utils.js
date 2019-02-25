import moment from 'moment';

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

function traverse(list, callback, deep=0) {
  list.forEach(item => {
    const children = item.children;
    callback(item, deep);
    if (Array.isArray(children))
      traverse(children, callback, deep + 1);
  });
}

// 生成新的树
export function genTreeList(list, callback, deep=0) {
  return list.map(item => {
    const { children, ...restProps } =  item;
    const newItem = callback(restProps);
    newItem.indentLevel = deep;
    if (children.length)
      newItem.children = genTreeList(children, callback, deep + 1);
    return newItem;
  });
}

export function handleSectionTree(list) {
  traverse(list, (item, deep) => {
    const { name, cardCount, lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus } = item;
    item.areaName = name;
    item.count = cardCount;
    item.status = lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 0 : 1;
    item.indentLevel = deep;
  });
}

export function getSectionTree(list) {
  return genTreeList(list, item => {
    const { id, name, cardCount, lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus } = item;
    return {
      id,
      areaName: name,
      count: cardCount,
      status: lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 0 : 1,
    };
  });
}
