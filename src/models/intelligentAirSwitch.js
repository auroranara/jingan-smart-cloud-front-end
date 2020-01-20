import { getList, setSwitchStatus, getDetail } from '@/services/intelligentAirSwitch';
const PRIORITY_MAPPER = {
  功率: 0,
  当前温度: 1,
  漏电电流: 2,
  A相电流: 3,
  B相电流: 4,
  C相电流: 5,
  A相电压: 6,
  B相电压: 7,
  C相电压: 8,
};

export default {
  namespace: 'intelligentAirSwitch',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    /* 获取列表 */
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'saveList',
          payload: {
            ...list,
            // list: list.list.map(item => ({
            //   ...item,
            //   allMonitorParam: (item.allMonitorParam || []).sort(
            //     ({ paramDesc: a }, { paramDesc: b }) => PRIORITY_MAPPER[a] - PRIORITY_MAPPER[b]
            //   ),
            // })),
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    *setSwitchStatus({ payload, callback }, { call, put }) {
      const response = yield call(setSwitchStatus, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        callback && callback(true);
      } else {
        callback && callback(false, msg);
      }
    },
    *reloadList({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'replaceItem',
          payload: data,
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveList: (
      state,
      {
        payload: {
          list,
          pagination,
          pagination: { pageNum },
        },
      }
    ) => ({
      ...state,
      list: {
        list: pageNum === 1 ? list : state.list.list.concat(list),
        pagination,
      },
    }),
    replaceItem: (state, { payload, payload: { id } }) => ({
      ...state,
      list: {
        ...state.list,
        list: state.list.list.map(item => (item.id === id ? payload : item)),
      },
    }),
  },
};
