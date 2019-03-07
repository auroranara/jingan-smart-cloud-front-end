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
        // console.log('list', list);
        const treeList = getSectionTree(list);
        // console.log('treeList', treeList);
        yield put({ type: 'saveSectionTree', payload: treeList });
        callback && callback(treeList);
      }
    },
  },

  reducers: {
    savePositions(state, action) {
      let { payload: list } = action;
      // list = list.filter(({ onlineStatus }) => +onlineStatus); // 过滤掉不在线的人，onlineStatus 1 在线  0 离线
      const aggList = genAggregation(list);
      // console.log('agg', list, aggList);
      return {
        ...state,
        positionList: list,
        positionAggregation: aggList,
      };
    },
    saveAlarms(state, action) {
      const list = action.payload;
      list.sort((a1, a2) => a2.warningTime - a1.warningTime);
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
