import { getList, getLatest, getTree, getPeople } from '../services/position';

// 格式化树
function formatTree(list, parentName) {
  return list.reduce((result, {
    companyMapPhoto,
    mapPhoto,
    range,
    id,
    name,
    parentId,
    companyMap,
    mapId,
    children,
  }) => {
    const fullName = parentName ? `${parentName}${name}` : name;
    return {
      url: !result.url && JSON.parse(companyMapPhoto).url,
      ...result,
      [id]: {
        ...(JSON.parse(range)),
        url: JSON.parse(mapPhoto).url,
        id,
        name,
        fullName,
        parentId,
        companyMap,
        mapId,
        children: children ? children.map(({ id }) => id) : [],
      },
      ...(children && formatTree(children, fullName)),
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
      options: { color: isAlarm ? '#ff4848' : '#00a8ff' },
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
    return Array.isArray(list) ? cloneTreeList(list) : [];
}

function getHisotryIdMap(list, idType) {
  const isCardId = +idType;
  return list.reduce((prev, next) => {
    const id = next[isCardId ? 'cardId' : 'userId'];
    if (id in prev)
      prev[id].push(next);
    else
      prev[id] = [next];

    return prev;
  }, {});
}

export default {
  namespace: 'position',

  state: {
    data: {
      // 当前选中时间段内涉及的区域
      areaDataHistories: [],
      // 当前选中时间段内涉及的人员位置
      locationDataHistories: [],
    },
    areaDataMap: {},
    historyIdMap: {},
    tree: {},
    originalTree: [],
    people: [],
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
      let areaDataMap = {};
      if (response.code === 200) {
        const { areaDataHistories, locationDataHistories } = response.data;
        const originHistoryIdMap = getHisotryIdMap(locationDataHistories, idType);
        const historyIdMap = Object.entries(originHistoryIdMap).reduce((prev, next) => {
          const [id, ids] = next;
          prev[id] = formatData(Array.from(ids));
          return prev;
        }, {});
        areaDataMap = getHisotryIdMap(areaDataHistories, idType);
        yield put({
          type: 'save',
          payload: {
            data: {
              areaDataHistories,
              locationDataHistories: formatData(locationDataHistories),
            },
            areaDataMap,
            historyIdMap,
          },
        });
      }
      if (callback) {
        callback(response, areaDataMap);
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
        yield put({ type: 'save', payload: { people } });
        callback && callback(people);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
