import {
  queryInitialPositions,
} from '../services/bigPlatform/personPosition';

export default {
  namespace: 'personPosition',

  state: {
    positions: [],
  },

  effects: {
    *fetchInitialPositions({ payload, callback }, { call, put }) {
      const response = yield call(queryInitialPositions, payload);
      const { code=500, data } = response;
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list: [];
        callback && callback(list);
        yield put({ type: 'savePositions', payload: list });
      }
    },
  },

  reducers: {
    savePositions(state, action) {
      return {
        ...state,
        positions: action.payload,
      };
    },
  },
};
