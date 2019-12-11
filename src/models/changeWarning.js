import {
  getWarningList,
} from '../services/changeWarning';
import { getList } from '@/utils/service';

export default {
  namespace: 'changeWarning',

  state: {
    total: 0,
    list: [],
  },

  effects: {
    *fetchCommitList({ payload, callback }, { call, put }) {
      const response = yield call(getWarningList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
  },

  reducers: {
    saveTotal(state, action) {
      return { ...state, total: action.payload };
    },
    saveList(state, action) {
      return { ...state, list: action.payload };
    },
  },
}
