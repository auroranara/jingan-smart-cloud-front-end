import {
  queryInitialPositions,
  queryInitialAlarms,
  postSOS,
  postOverstep,
  querySectionTree,
} from '../services/bigPlatform/personPosition';
import { handleSectionTree, getSectionTree } from '@/pages/BigPlatform/Position/utils';

export default {
  namespace: 'personPosition',

  state: {
    positions: [],
    sectionTree: [],
    alarms: [],
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
    *fetchInitAlarms({ payload, callback }, { call, put }) {
      const response = yield call(queryInitialAlarms, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list: [];
        callback && callback(list);
        yield put({ type: 'saveAlarms', payload: list });
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
    *fetchSectionTree({ payload, callback }, { call, put }) {
      const response = yield call(querySectionTree, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveSectionTree', payload: list })
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
    saveAlarms(state, action) {
      return {
        ...state,
        alarms: action.payload,
      };
    },
    saveSectionTree(state, action) {
      console.log(getSectionTree(action.payload));
      return {
        ...state,
        sectionTree: getSectionTree(action.payload),
      };
    },
  },
};
