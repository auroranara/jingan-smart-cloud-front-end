import { queryFakeList } from '../services/api.js';

export default {
  namespace: 'companydetail',

  state: {
    list: [],
    scrollY: 0,
  },

  effects: {
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      if (response.status === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
  },

  reducers: {
    appendList(state, { payload }) {
      return {
        ...state,
        list: [...state.list, ...payload],
      };
    },
    setScrollY(state, { payload }) {
      return {
        ...state,
        scrollY: payload,
      };
    },
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
  },
};
