import { getList, getLatest, getTree } from '../services/position';
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
    locationStatusHistoryList,
  }, index) => {
    const isAlarm = locationStatusHistoryList && locationStatusHistoryList.length > 0;
    return {
      id,
      xarea,
      yarea,
      zarea,
      intime,
      // 当前时间节点的离开时间和下个时间节点的进入时间相等时，就将当前时间节点的离开时间提前1s
      uptime: list[index+1] && list[index+1].intime === uptime? Math.max(uptime-1000, intime) : uptime,
      areaId,
      latlng: { lng, lat },
      isVistor: +cardType === 1,
      isAlarm,
      options: { color: isAlarm ? '#ff4848' : '#00a8ff' },
      locationStatusHistoryList,
    };
  });
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
    tree: {},
  },

  effects: {
    // 获取最新的一条数据
    *fetchLatest({ payload, callback }, { call, put }) {
      const response = yield call(getLatest, payload);
      callback && callback(response);
    },
    // 获取选中数据
    *fetchData({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      if (response.code === 200) {
        const { areaDataHistories, locationDataHistories } = response.data;
        yield put({ type: 'save', payload: { data: { areaDataHistories, locationDataHistories: formatData(locationDataHistories) } }});
      }
      if (callback) {
        callback(response);
      }
    },
    // 获取区域树
    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(getTree, payload);
      if (response.code === 200) {
        yield put({ type: 'save', payload: { tree: formatTree(response.data.list) }});
      }
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
