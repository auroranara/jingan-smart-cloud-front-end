import { getGrids } from '../services/bigPlatform/gridSelect';

export default {
  namespace: 'bigFireControl',

  state: {
    grids: [],
  },

  effects: {
    *fetchGrids({ payload, callback }, { call, put }) {
      const response = yield call(getGrids);
      if (Array.isArray(response)) {
        yield put({ type: 'saveGrids', payload: response });
        callback && callback(response);
      }
    },
  },

  reducers: {
    saveGrids(state, action) {
      return { ...state, grids: action.payload };
    },
  },
}
