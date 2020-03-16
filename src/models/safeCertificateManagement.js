import {
  getCompany,
  getCompanySafety,
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/baseInfo/safeCertificateManagement';

export default {
  namespace: 'safeCertificateManagement',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            list: data,
          },
        });
        callback && callback(data);
      }
    },
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = data;
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    *getCompany({ payload, callback }, { call, all }) {
      const responseList = yield all([call(getCompany, payload), call(getCompanySafety, payload)]);
      const [
        { code: code1, data: data1, msg: msg1 } = {},
        { code: code2, data: data2, msg: msg2 } = {},
      ] = responseList || [];
      callback && callback(true, { ...data1, ...data2 });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
