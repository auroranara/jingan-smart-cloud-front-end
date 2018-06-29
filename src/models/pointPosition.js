import { queryHostDetail } from '../services/pointPosition';

export default {
  namespace: 'pointPosition',

  state: {
    hostDetail: {},
  },

  effects: {
    *fetchHostDetail({ payload }, { call, put }) {
      const response = yield call(queryHostDetail, payload);
      if (response.code === 200) {
        yield put({ type: 'receiveHostDetail', payload: response.data });
      }
    },
  },

  reducers: {
    receiveHostDetail(state, action) {
      return { ...state, hostDetail: action.payload };
    },
  },
};
