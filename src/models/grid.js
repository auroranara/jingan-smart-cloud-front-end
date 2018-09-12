import { fetchGridLocationById, updateGridLocation } from '../services/grid/map';

export default {
  namespace: 'grid',

  state: {
    location: [],
  },

  effects: {
    *fetchGridMapLocationById({ payload }, { call, put }) {
      const response = yield call(fetchGridLocationById, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveLocation',
          payload: response.data,
        });
      }
    },
    *updateGridMapLocation({ payload }, { call, put }) {
      const response = yield call(updateGridLocation, payload);
      console.log(response);
    },
  },

  reducers: {
    saveLocation(state, action) {
      return {
        ...state,
        location: action.payload,
      };
    },
  },
};
