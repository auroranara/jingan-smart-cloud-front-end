import {
  getCompany,
  getTypeList,
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/accidentReport';

export default {
  namespace: 'accidentReport',

  state: {
    list: {},
    detail: {},
    typeList: [],
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
    *getTypeList({ payload, callback }, { call, put, select }) {
      const { parentId } = payload;
      const response = yield call(getTypeList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const prevTypeList = parentId ? (yield select((state) => state.accidentReport.typeList)) : [];
        const typeList = prevTypeList.concat(data.list.map(({ id, hasChild, value, label }) => ({ id, pId: parentId, value: id, title: `${value} ${label}`, isLeaf: !+hasChild })));
        yield put({
          type: 'save',
          payload: {
            typeList,
          },
        });
        callback && callback(typeList);
      }
    },
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const detail = data;
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
      }
    },
    *getCompany({ payload, callback }, { call, put }) {
      const response = yield call(getCompany, payload);
      const { code, data, msg } = response || {};
      callback && callback(code === 200, data || msg);
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
}
