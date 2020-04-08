import { queryCardAdd, queryCardEdit, queryCardList } from '@/services/visitorRegistration';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'visitorRegistration',

  state: {
    registrationData: defaultData,
    cardData: defaultData,
  },

  effects: {
    // 新增访客卡
    *fetchCardAdd({ payload, callback }, { call }) {
      const res = yield call(queryCardAdd, payload);
      callback && callback(res && res.code === 200, res.msg);
    },

    // 编辑访客卡
    *fetchCardEdit({ payload, callback }, { call }) {
      const res = yield call(queryCardEdit, payload);
      callback && callback(res && res.code === 200, res.msg);
    },

    // 获取人员列表
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
  },
};
