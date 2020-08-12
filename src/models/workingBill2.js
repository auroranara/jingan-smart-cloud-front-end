import { getList, getCount, getDetail, add, edit, remove, approve } from '@/services/workingBill2';

export default {
  namespace: 'workingBill2',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    // 列表
    *getList({ payload, callback }, { call, put, all }) {
      const responseList = yield all([
        call(getList, payload),
        call(getCount, { approveStatus: '1' }),
        call(getCount, { workingStatus: '2' }),
      ]);
      const [{ code, data, msg } = {}, { data: data1 } = {}, { data: data2 } = {}] =
        responseList || [];
      if (code === 200 && data && data.list) {
        const list = {
          ...data,
          approveCount:
            data1 && data1.list
              ? data1.list.reduce((result, { type, count }) => ({ ...result, [type]: count }), {})
              : {},
          workingCount:
            data2 && data2.list
              ? data2.list.reduce((result, { type, count }) => ({ ...result, [type]: count }), {})
              : {},
        };
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
    // 详情
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
    // 审批
    *approve({ payload, callback }, { call }) {
      const response = yield call(approve, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 重新申请
    *reapply({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};
