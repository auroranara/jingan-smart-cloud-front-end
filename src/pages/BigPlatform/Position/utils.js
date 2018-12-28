export function handlePositions(positions=[], wsData=[]) {
  if (!wsData || !wsData.length)
    return positions;

  const ids = wsData.map(({ cardId }) => cardId);
  // 不包含在websocket推送中且在线的卡
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

export function getSOSItem(cardId, list) {
  return list.find(item => item.cardId === cardId);
}

export function getOverstepItem(cardId, list) {
  return list.find(item => item.cardId === cardId);
}
