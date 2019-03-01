import {
  queryInitialPositions,
  queryInitialAlarms,
  quitSOS,
  putAlarm,
  querySectionTree,
} from '../services/bigPlatform/personPosition';
import { genAggregation, getSectionTree } from '@/pages/BigPlatform/Position/utils';

export default {
  namespace: 'personPosition',

  state: {
    positionList: [],
    positionAggregation: [],
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
    *handleSOS({ payload, callback }, { call }) {
      const response = yield call(quitSOS, payload);
      const { code=500, msg } = response || {};
      callback && callback(code, msg);
    },
    *handleAlarm({ payload, callback }, { call }) {
      const response = yield call(putAlarm, payload);
      const { code=500, msg } = response || {};
      callback && callback(code, msg);
    },
    *fetchSectionTree({ payload, callback }, { call, put }) {
      const response = yield call(querySectionTree, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveSectionTree', payload: getSectionTree(list) })
        callback && callback(list);
      }
    },
  },

  reducers: {
    savePositions(state, action) {
      const { payload: list } = action;
      const aggList = genAggregation(list);
      // console.log('agg', list, aggList);
      return {
        ...state,
        positionList: list,
        positionAggregation: aggList,
      };
    },
    saveAlarms(state, action) {
      return {
        ...state,
        alarms: action.payload,
      };
    },
    saveSectionTree(state, action) {
      return {
        ...state,
        sectionTree: action.payload,
      };
    },
  },
};
