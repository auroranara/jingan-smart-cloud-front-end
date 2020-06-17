import { getList, getDetail, add, edit, approve, getApproveDetail } from '@/services/change';
import { message } from 'antd';

export default {
  namespace: 'change',

  state: {
    list: {},
    detail: {},
    approveDetail: {},
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        message.error('获取变更列表数据失败，请稍后重试！');
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
        message.error('获取申请信息失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('申请信息添加成功！');
        callback && callback(true);
      } else {
        message.error('申请信息添加失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('申请信息编辑成功！');
        callback && callback(true);
      } else {
        message.error('申请信息编辑失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *approve({ payload, callback }, { call }) {
      const response = yield call(approve, payload);
      const { code, msg } = response || {};
      if (code === 200) {
        message.success('验收信息添加成功！');
        callback && callback(true);
      } else {
        message.error('验收信息添加失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *getApproveDetail({ payload, callback }, { call, put }) {
      const response = yield call(getApproveDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const approveDetail = data;
        yield put({
          type: 'save',
          payload: {
            approveDetail,
          },
        });
        callback && callback(true, approveDetail);
      } else {
        message.error('获取验收信息失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
