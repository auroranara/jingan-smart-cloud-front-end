import {
  getCompanyList,
  getAlarmList,
  getMapList,
  getAreaList,
  getAreaLimits,
  getAllCards,
  getAlarmStrategy,
  postAlarmStrategy,
  putAlarmStrategy,
  deleteAlarmStrategy,
} from '../services/personnelPosition/alarmManagement';
import { handleAllCards } from '@/pages/PersonnelPosition/AlarmManagement/utils';

export default {
  namespace: 'personPositionAlarm',

  state: {
    companyList: [],
    alarmList: [],
    mapList: [],
    areaList: [],
    areaLimits: {},
    allCards: [], // 所有人员列表
    detail: {},
  },

  effects: {
    *fetchCompanyList({ payload, callback }, { call, put }) {
      let response = yield call(getCompanyList, payload);
      response = response || {};
      let { code=500, data } = response;
      data = data || {};
      if (code === 200) {
        callback && callback(data.pagination && data.pagination.total ? data.pagination.total : 0);
        yield put({ type: 'saveCompanyList', payload: data });
      }
    },
    *fetchAlarmList({ payload, callback }, { call, put }) {
      let response = yield call(getAlarmList, payload);
      response = response || {};
      let { code=500, data } = response;
      data = data || {};
      if (code === 200) {
        yield put({ type: 'saveAlarmList', payload: data && Array.isArray(data.list) ? data.list : [] });
        data.pagination && callback && callback(data.pagination.pageNum);
      }
    },
    *fetchMapList({ payload, callback }, { call, put }) {
      let response = yield call(getMapList, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveMapList', payload: list });
        callback && callback(list);
      }
    },
    *fetchAreaList({ payload, callback }, { call, put }) {
      let response = yield call(getAreaList, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveAreaList', payload: list });
        callback && callback(list);
      }
    },
    *fetchAreaLimits({ payload, callback }, { call, put }) {
      let response = yield call(getAreaLimits, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200) {
        const limits = data || {};
        yield put({ type: 'saveAreaLimits', payload: limits });
        callback && callback(limits);
      }
    },
    *fetchAllCards({ payload, callback }, { call, put }) {
      let response = yield call(getAllCards, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200) {
        yield put({ type: 'saveAllCards', payload: data && Array.isArray(data.list) ? data.list : [] });
        callback && callback(data);
      }
    },
    *getAlarmStrategy({ payload, callback }, { call, put }) {
      let response = yield call(getAlarmStrategy, payload);
      response = response || {};
      const { code=500, data } = response;
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *addAlarmStrategy({ payload, callback }, { call, put }) {
      let response = yield call(postAlarmStrategy, payload);
      response = response || {};
      const { code, msg } = response;
      callback && callback(code, msg);
    },
    *editAlarmStrategy({ payload, callback }, { call, put }) {
      let response = yield call(putAlarmStrategy, payload);
      response = response || {};
      const { code, msg } = response;
      callback && callback(code, msg);
    },
    *delAlarmStartegy({ payload, callback }, { call, put }) {
      let response = yield call(deleteAlarmStrategy, payload);
      response = response || {};
      const { code, msg } = response;
      callback && callback(code, msg);
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      const {
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.companyList.concat(list);
      return { ...state, companyList: nextList };
    },
    saveAlarmList(state, action) {
      return { ...state, alarmList: action.payload };
    },
    saveMapList(state, action) {
      return { ...state, mapList: action.payload };
    },
    saveAreaList(state, action) {
      return { ...state, areaList: action.payload };
    },
    saveAreaLimits(state, action) {
      return { ...state, areaLimits: action.payload };
    },
    saveAllCards(state, action) {
      return { ...state, allCards: handleAllCards(action.payload) };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
