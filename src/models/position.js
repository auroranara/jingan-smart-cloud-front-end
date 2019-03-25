import { getList, getLatest, getTree, getPeople, getCards } from '../services/position';
import moment from 'moment';

// 格式化树
function formatTree(list, parentName='', parentMapId, parentIds=[]) {
  return (list || []).reduce((result, {
    mapPhoto,
    range,
    id,
    name,
    parentId,
    companyMap,
    mapId,
    children: childList,
  }) => {
    const fullName = `${parentName}${name}`;
    const { children, isBuilding } = (childList || []).reduce((obj, { id, mapId: childMapId }) => {
      obj.children.push(id);
      obj.isBuilding = obj.isBuilding || childMapId !== mapId; // 如果当前区域与子区域的图片不同，则认为当前区域是建筑
      return obj;
    }, { children: [], isBuilding: false });
    const childrenResult = formatTree(childList, fullName, mapId, parentIds.concat(id));
    return {
      ...result,
      ...childrenResult,
      [id]: {
        ...(JSON.parse(range)),
        url: JSON.parse(mapPhoto).url,
        id,
        name,
        fullName,
        parentId,
        companyMap,
        mapId,
        children,
        descendants: Object.keys(childrenResult),
        parentIds,
        isBuilding, // 是否是建筑
        isFloor: parentMapId ? parentMapId !== mapId : false, // 如果当前区域与父区域的图片不同，则认为当前区域是楼层
      },
    };
  }, {});
};
// 格式化位置数据
function formatData(list) {
  return list.map(({
    id,
    xarea,
    yarea,
    zarea,
    intime,
    uptime,
    areaId,
    xpx: lng,
    ypx: lat,
    cardType,
    userName,
    vistorName,
    locationStatusHistoryList,
  }, index) => {
    const isAlarm = locationStatusHistoryList && locationStatusHistoryList.length > 0;
    return {
      id,
      xarea,
      yarea,
      zarea,
      intime,
      // 当前时间节点的离开时间和下个时间节点的进入时间相等时，就将当前时间节点的离开时间提前1s，为了确保两个时间节点之间有1s的移动动画
      uptime: list[index+1] && list[index+1].intime === uptime? Math.max(uptime-1000, intime) : uptime,
      areaId,
      latlng: { lng, lat },
      isVistor: +cardType === 1,
      userName,
      vistorName,
      isAlarm,
      options: { color: isAlarm ? '#ff4848' : '#00ffff' },
      locationStatusHistoryList,
    };
  });
}

function cloneTreeList(list) {
  return list.map(({ id, name, children }) => {
    const cloned = { title: name, value: id, key: id };
    if (children && children.length)
      cloned.children = cloneTreeList(children);
    return cloned;
  });
}

function getSelectTree(list) {
    const treeList = Array.isArray(list) ? cloneTreeList(list) : [];
    // treeList.forEach(ls => delete ls.children);
    return treeList;
}

function getHistoryIdMap(list, idType) {
  const isCardId = +idType;
  return list.reduce((result, item) => {
    let id = item[isCardId ? 'cardId' : 'userId'];
    if (id in result) {
      result[id].push(item);
    }
    else {
      result[id] = [item];
    }
    return result;
  }, {});
}

export default {
  namespace: 'position',

  state: {
    // 时间段内的人员数组
    areaDataList: [],
    // 轨迹数据对象
    historyIdMap: {},
    // 选中的时间范围
    timeRange: [moment().startOf('minute').subtract(24, 'hours'), moment().startOf('minute')],
    // 表格中当前选中的人员或卡片id
    selectedIds: [],
    // 当前选中的表格行
    selectedTableRow: 'all',
    // 区域树对象
    tree: {},
    // 区域树数组
    originalTree: [],
    // 人员列表
    people: [],
    // 卡片列表
    cards: [],
    // 搜索框支持格式的区域树
    sectionTree: [],
  },

  effects: {
    // 获取最新的一条数据
    *fetchLatest({ payload, callback }, { call, put }) {
      const response = yield call(getLatest, payload);
      callback && callback(response);
    },
    // 获取选中数据
    *fetchData({ payload, callback }, { call, put }) {
      const idType = payload.idType;
      delete payload.idType;
      const response = yield call(getList, payload);
      if (response.code === 200) {
        const { areaDataHistories, locationDataHistories } = response.data;
        // 轨迹数据
        const originHistoryIdMap = getHistoryIdMap(locationDataHistories, idType);
        const historyIdMap = Object.entries(originHistoryIdMap).reduce((prev, next) => {
          const [id, list] = next;
          prev[id] = formatData(list);
          return prev;
        }, {});
        // 时间段内的人员或卡片列表
        const areaDataList = areaDataHistories;
        const sortFn = +idType
          ? (a, b) => a.cardCode - b.cardCode
          : (a, b) => a.userName.localeCompare(b.userName, 'zh-Hans-CN', {sensitivity: 'accent'});
        areaDataList.sort(sortFn);
        // 时间范围
        const { startTime=payload.queryStartTime, endTime=payload.queryEndTime } = areaDataList.reduce((prev, next) => ({
          startTime: Math.min(prev.startTime, next.startTime),
          endTime: Math.max(prev.endTime, next.endTime),
        }));
        const timeRange = [Math.max(startTime, payload.queryStartTime), Math.min(endTime, payload.queryEndTime)];
        // 选中的人员或卡片id
        const selectedIds = Object.keys(historyIdMap);
        yield put({
          type: 'save',
          payload: {
            areaDataList,
            historyIdMap,
            timeRange,
            selectedIds,
            selectedTableRow: 'all',
          },
        });
      }
      if (callback) {
        callback(response);
      }
    },
    // 获取区域树
    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(getTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            tree: formatTree(response.data.list),
            originalTree: response.data.list,
            sectionTree: getSelectTree(response.data.list),
          }});
      }
      if (callback) {
        callback(response);
      }
    },
    // 获取人员列表
    *fetchPeople({ payload, callback }, { call, put }) {
      const response = yield call(getPeople, payload);
      const { code, data={} } = response || {};
      if (code === 200) {
        const { list } = data || {};
        const people = list || [];
        people.sort((a, b) => a.user_name.localeCompare(b.user_name, 'zh-Hans-CN', {sensitivity: 'accent'}));
        yield put({ type: 'save', payload: { people } });
        callback && callback(people);
      }
    },
    // 获取卡片列表
    *fetchCards({ payload, callback }, { call, put }) {
      const response = yield call(getCards, payload);
      const { code, data={} } = response || {};
      if (code === 200) {
        const { list } = data || {};
        const cards = list || [];
        cards.sort((c1, c2) => c1.code - c2.code);
        yield put({ type: 'save', payload: { cards } });
        callback && callback(cards);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
