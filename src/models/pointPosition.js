import { fetchPointPositionData } from '../services/pointPosition';

export default {
  namespace: 'pointPosition',

  state: {},

  effects: {
    *fetchPointData({ payload }, { call }) {
      const response = yield call(fetchPointPositionData, payload);
      console.log(response);
    },
  },

  reducers: {},
};
