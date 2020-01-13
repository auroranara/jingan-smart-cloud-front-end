import { getMediumList, getList, getDetail, add, edit, remove } from '@/services/pipeline';

export default {
  namespace: 'pipeline',

  state: {
    list: {},
    detail: {},
    mediumList: {},
  },

  effects: {
    // 获取介质列表
    *getMediumList({ payload, callback }, { call, put }) {
      const response = yield call(getMediumList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const mediumList = data;
        yield put({
          type: 'save',
          payload: {
            mediumList,
          },
        });
        callback && callback(true, mediumList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list: {
              ...list,
              pagination: {
                ...list.pagination,
                companyCount: +msg || 0,
              },
            },
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取详情
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
    // 新增
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
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
