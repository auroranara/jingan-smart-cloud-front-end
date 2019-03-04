import { getList, getLatest, getTree } from '../services/position';
// 格式化树
function formatTree(list) {
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
    return {
      url: !result.url && JSON.parse(companyMapPhoto).url,
      ...result,
      [id]: {
        ...(JSON.parse(range)),
        url: JSON.parse(mapPhoto).url,
        id,
        name,
        parentId,
        companyMap,
        mapId,
        children: children ? children.map(({ id }) => id) : [],
      },
      ...(children && formatTree(children)),
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
    locationStatusHistoryList,
  }, index) => {
    const { sos, over, long } = locationStatusHistoryList ? locationStatusHistoryList.reduce((result, { status }) => {
      if (!result.sos && +status === 1) {
        result.sos = true;
      }
      else if (!result.over && +status === 2) {
        result.over = true;
      }
      else if (!result.long && +status === 3) {
        result.long = true;
      }
      return result;
    }, {}) : {};
    const isAlarm = sos || over || long;
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
      isAlarm,
      options: { color: isAlarm ? '#ff4848' : '#00a8ff' },
      sos,
      over,
      long,
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
