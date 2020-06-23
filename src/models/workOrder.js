import { getList, getDetail, getMessageList } from '@/services/workOrder';
import { message } from 'antd';

export default {
  namespace: 'workOrder',

  state: {
    list: {},
    detail: {},
    messageList: {},
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
    // 获取消息列表
    *getMessageList({ payload, callback }, { call, put }) {
      const response = yield call(getMessageList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const messageList = data;
        yield put({
          type: 'save',
          payload: {
            messageList,
          },
        });
        callback && callback(true, messageList);
      } else {
        message.error('获取消息列表数据失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
