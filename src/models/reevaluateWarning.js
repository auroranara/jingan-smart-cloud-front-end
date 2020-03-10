import {
  getList,
  getReevaluatorList,
  reevaluate,
  getHistory,
} from '@/services/reevaluateWarning';

const defaultData = {
  list: [],
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
};

export default {
  namespace: 'reevaluateWarning',

  state: {
    // 复评预警管理
    list: defaultData,
    // 复评人员
    reviewer: defaultData,
    reevaluatorList: [],
    // 历史记录
    history: defaultData,
  },

  effects: {
    // 获取列表
    *getList ({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取复评人员列表
    *getReevaluatorList ({ payload, callback }, { call, put }) {
      const response = yield call(getReevaluatorList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data.list.map(({ users, userName: value }) => ({ key: users[0].id, value }));
        yield put({
          type: 'save',
          payload: {
            reviewer: { ...data, list },
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 复评
    *reevaluate ({ payload, callback }, { call }) {
      const response = yield call(reevaluate, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取历史记录
    *getHistory ({ payload, callback }, { call, put }) {
      const response = yield call(getHistory, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const history = data;
        yield put({
          type: 'save',
          payload: {
            history,
          },
        });
        callback && callback(true, history);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
