import {
  getCommitList,
  addCommitItem,
  getCommitItem,
  editCommitItem,
  deleteCommitItem,
  getKnowList,
  addKnowItem,
  getKnowItem,
  editKnowItem,
  deleteKnowItem,
  getEmergencyList,
  addEmergencyItem,
  getEmergencyItem,
  editEmergencyItem,
  deleteEmergencyItem,
  getInformCards,
  getRiskTypes,
} from '../services/cardsInfo';
import { getList } from '@/utils/service';

export default {
  namespace: 'cardsInfo',

  state: {
    commitTotal: 0,
    commitList: [],
    commitDetail: {},
    knowTotal: 0,
    knowList: [],
    knowDetail: {},
    emergencyTotal: 0,
    emergencyList: [],
    emergencyDetail: {},
    informTotal: 0,
    informCards: [],
    riskTypes: [],
  },

  effects: {
    *fetchCommitList({ payload, callback }, { call, put }) {
      const response = yield call(getCommitList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveCommitTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveCommitList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *getCommitCard({ payload, callback }, { call, put }) {
      const response = yield call(getCommitItem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveCommitDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *addCommitCard({ payload, callback }, { call }) {
      const response = yield call(addCommitItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *editCommitCard({ payload, callback }, { call }) {
      const response = yield call(editCommitItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *deleteCommitCard({ payload, callback }, { call }) {
      const response = yield call(deleteCommitItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *fetchKnowList({ payload, callback }, { call, put }) {
      const response = yield call(getKnowList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveKnowTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveKnowList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *getKnowCard({ payload, callback }, { call, put }) {
      const response = yield call(getKnowItem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveKnowDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *addKnowCard({ payload, callback }, { call }) {
      const response = yield call(addKnowItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *editKnowCard({ payload, callback }, { call }) {
      const response = yield call(editKnowItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *deleteKnowCard({ payload, callback }, { call }) {
      const response = yield call(deleteKnowItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *fetchEmergencyList({ payload, callback }, { call, put }) {
      const response = yield call(getEmergencyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveEmergencyTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveEmergencyList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *getEmergencyCard({ payload, callback }, { call, put }) {
      const response = yield call(getEmergencyItem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveEmergencyDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *addEmergencyCard({ payload, callback }, { call }) {
      const response = yield call(addEmergencyItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *editEmergencyCard({ payload, callback }, { call }) {
      const response = yield call(editEmergencyItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *deleteEmergencyCard({ payload, callback }, { call }) {
      const response = yield call(deleteEmergencyItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *fetchInformCards({ payload, callback }, { call, put }) {
      const response = yield call(getInformCards, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({ type: 'saveInformTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveInformCards', payload: getList(data) });
      }
    },
    *fetchRiskTypes({ payload }, { call, put }) {
      const response = yield call(getRiskTypes, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveRiskTypes', payload: getList(data) });
    },
  },

  reducers: {
    saveCommitTotal(state, action) {
      return { ...state, commitTotal: action.payload };
    },
    saveCommitList(state, action) {
      return { ...state, commitList: action.payload };
    },
    saveCommitDetail(state, action) {
      return { ...state, commitDetail: action.payload };
    },
    saveKnowTotal(state, action) {
      return { ...state, knowTotal: action.payload };
    },
    saveKnowList(state, action) {
      return { ...state, knowList: action.payload };
    },
    saveKnowDetail(state, action) {
      return { ...state, knowDetail: action.payload };
    },
    saveEmergencyTotal(state, action) {
      return { ...state, emergencyTotal: action.payload };
    },
    saveEmergencyList(state, action) {
      return { ...state, emergencyList: action.payload };
    },
    saveEmergencyDetail(state, action) {
      return { ...state, emergencyDetail: action.payload };
    },
    saveInformTotal(state, action) {
      return { ...state, informTotal: action.payload };
    },
    saveInformCards(state, action) {
      return { ...state, informCards: action.payload };
    },
    saveRiskTypes(state, action) {
      return { ...state, riskTypes: action.payload };
    },
  },
}
