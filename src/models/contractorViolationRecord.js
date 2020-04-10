import { getList, getDetail, add, edit, remove } from '@/services/contractorViolationRecord';
import { message } from 'antd';

export default {
  namespace: 'contractorViolationRecord',

  state: {
    list: {},
    detail: {},
  },

  effects: {
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
        message.error('获取列表数据失败，请稍后重试！');
        callback && callback(false, msg);
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
        message.error('获取详情数据失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('新增成功！');
        callback && callback(true, msg);
      } else {
        message.error(`新增失败，${msg}！`);
        callback && callback(false, msg);
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('编辑成功！');
        callback && callback(true, msg);
      } else {
        message.error(`编辑失败，${msg}！`);
        callback && callback(false, msg);
      }
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('删除成功！');
        callback && callback(true, msg);
      } else {
        message.error(`删除失败，${msg}！`);
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
