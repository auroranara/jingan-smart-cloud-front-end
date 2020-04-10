import {
  queryCardAdd,
  queryCardEdit,
  queryCardList,
  queryCardDel,
  queryVisitorAdd,
  queryVisitorList, // 获取访客登记列表
  queryHasVisitorList, // 获取已登记列表
  queryCancelCard, // 退卡
} from '@/services/visitorRegistration';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'visitorRegistration',

  state: {
    registrationData: defaultData,
    cardData: defaultData,
    hasRegistrationData: defaultData,
  },

  effects: {
    // 新增访客卡
    *fetchCardAdd({ payload, callback }, { call }) {
      const res = yield call(queryCardAdd, payload);
      callback && callback(res && res.code === 200, res.msg, res.data);
    },

    // 编辑访客卡
    *fetchCardEdit({ payload, callback }, { call }) {
      const res = yield call(queryCardEdit, payload);
      if (callback) callback(res);
    },

    // 获取访客卡列表
    *fetchCardList({ payload, callback }, { call, put }) {
      const res = yield call(queryCardList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveCardList',
          payload: res.data,
        });
        if (callback) callback(res);
      }
    },

    // 删除访客卡
    *fetchCardDel({ payload, callback }, { call }) {
      const res = yield call(queryCardDel, payload);
      callback && callback(res && res.code === 200);
    },

    // 新增访客登记
    *fetchVisitorAdd({ payload, callback }, { call }) {
      const res = yield call(queryVisitorAdd, payload);
      if (callback) callback(res);
    },

    // 获取访客登记列表
    *fetchVisitorList({ payload, callback }, { call, put }) {
      const res = yield call(queryVisitorList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveVisitorList',
          payload: res.data,
        });
        if (callback) callback(res);
      }
    },

    // 获取已访客登记列表
    *fetchHasVisitorList({ payload, callback }, { call, put }) {
      const res = yield call(queryHasVisitorList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveHasVisitorList',
          payload: res.data,
        });
        if (callback) callback(res);
      }
    },

    // 退卡
    *fetchCancelCard({ payload, callback }, { call }) {
      const res = yield call(queryCancelCard, payload);
      callback && callback(res && res.code === 200);
    },
  },

  reducers: {
    saveCardList(state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        cardData: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },

    saveVisitorList(state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        registrationData: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },

    saveHasVisitorList(state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        hasRegistrationData: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
  },
};
