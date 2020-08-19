import {
  getList,
  getHistory,
  getDetail,
  add,
  edit,
  audit,
  publish,
  submitReview,
  start,
} from '@/services/emergencyPlan';

export default {
  namespace: 'emergencyPlan',

  state: {
    list: {},
    history: {},
    detail: {},
  },

  effects: {
    *fetchList ({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            list: data || {},
          },
        });
      }
    },
    *fetchHistory ({ payload }, { call, put }) {
      const response = yield call(getHistory, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            history: data || {},
          },
        });
      }
    },
    *fetchDetail ({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const { recordCertificateList, emergencyFilesList } = data || {};
        const detail = {
          ...data,
          recordCertificateList: recordCertificateList && recordCertificateList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1 - index, status: 'done' })),
          emergencyFilesList: emergencyFilesList && emergencyFilesList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1 - index, status: 'done' })),
        };
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
      }
    },
    *add ({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *edit ({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *audit ({ payload, callback }, { call }) {
      const response = yield call(audit, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *publish ({ payload, callback }, { call }) {
      const response = yield call(publish, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *submitReview ({ payload, callback }, { call }) {
      const res = yield call(submitReview, payload)
      if (callback) callback(res)
    },
    *startPlan({ payload, callback }, { call }) {
      const response = yield call(start, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
