import {
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/operationRecord';

export default {
  namespace: 'operationRecord',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
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
        const { otherFileList } = data;
        const detail = {
          ...data,
          otherFile: otherFileList && otherFileList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1-index, status: 'done' })),
        };
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
}
