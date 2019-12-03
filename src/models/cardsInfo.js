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
} from '../services/cardsInfo';
import { getList } from '@/utils/service';

export default {
  namespace: 'cardsInfo',

  state: {
    commitTotal: 0,
    commitList: [],
    commitDetail: {},
  },

  effects: {
    *fetchCommitList({ payload, callback }, { call, put }) {
      const response = yield call(getCommitList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveTableList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *getCommitCard({ payload, callback }, { call, put }) {
      const response = yield call(getCommitItem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveDetail', payload: detail });
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
  },

  reducers: {
    saveTotal(state, action) {
      return { ...state, total: action.payload };
    },
    saveTableList(state, action) {
      return { ...state, list: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
}
