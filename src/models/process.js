import {
  fetchHighRiskProcessList,
  fetchHighRiskProcessDetail,
} from '@/services/majorHazardInfo';
import { queryMonitorList } from '@/services/baseInfo/materials';
import { getList } from '@/utils/service';

export default {
  namespace: 'process',

  state: {
    list: [],
    detail: {},
    monitorList: [],
  },

  effects: {
    *fetchProcessList({ payload, callback }, { call, put }) {
      const response = yield call(fetchHighRiskProcessList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const list = getList(data);
        yield put({ type: 'saveList', payload: list });
        callback && callback(list);
      }
    },
    *fetchProcessDetail({ payload, callback }, { call, put }) {
      const res = yield call(fetchHighRiskProcessDetail, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
        callback && callback(res.data);
      }
    },
    *fetchMonitorList({ payload, callback }, { call, put }) {
      const response = yield call(queryMonitorList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const list = getList(data);
        yield put({ type: 'saveMonitorList', payload: list });
        callback && callback(list);
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return { ...state, list: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
    saveMonitorList(state, action) {
      return { ...state, monitorList: action.payload };
    },
  },
};
