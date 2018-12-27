export function handlePositions(positions=[], wsData=[]) {
  if (!wsData || !wsData.length)
    return positions;

  const ids = wsData.map(({ cardId }) => cardId);
  // 不包含在websocket推送中且在线的卡
  const pos = positions.filter(({ cardId, onlineStatus }) => !ids.includes(cardId) && Number.parseInt(onlineStatus, 10));
  return [...pos, ...wsData];
}

export function handleInitialInfo(positions) {
  return positions.map(({ cardId, uptime }) => ({ id: cardId, time: uptime, desc: '进入房间' }));
}

export function handlePosInfo(info, wsData=[]) {
  if (!wsData || !wsData.length)
    return info;

  const newInfo = wsData.filter(({ areaChanged }) => areaChanged).map(({ cardId, uptime, areaChangedDesc }) => ({ id: cardId, time: uptime, desc: areaChangedDesc }));
  return [...info, ...newInfo];
}
