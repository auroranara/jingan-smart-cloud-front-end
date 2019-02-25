import {
  queryInitialPositions,
  postSOS,
  postOverstep,
  querySections,
} from '../services/bigPlatform/personPosition';
import { handleSectionTree } from '@/pages/BigPlatform/Position/utils';

export default {
  namespace: 'personPosition',

  state: {
    positions: [],
    sections: [],
  },

  effects: {
    *fetchInitialPositions({ payload, callback }, { call, put }) {
      const response = yield call(queryInitialPositions, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list: [];
        callback && callback(list);
        yield put({ type: 'savePositions', payload: list });
      }
    },
    *quitSOS({ payload, callback }, { call }) {
      const response = yield call(postSOS, payload);
      const { code=500 } = response || {};
      if (code === 200)
        callback && callback();
    },
    *quitOverstep({ payload, callback }, { call }) {
      const response = yield call(postOverstep, payload);
      const { code=500 } = response || {};
      if (code === 200)
        callback && callback();
    },
    *fetchSections({ payload, callback }, { call, put }) {
      const response = yield call(querySections, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveSections', payload: list })
        callback && callback(list);
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
    saveSections(state, action) {
      return {
        ...state,
        sections: handleSectionTree(action.payload),
      };
    },
  },
};
