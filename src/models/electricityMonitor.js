
import { getMessages, getCompanyId } from '../services/electricityMonitor'

export default {
  namespace: 'electricityMonitor',

  state: {
    // 告警信息列表
    messages: [],
  },

  effects: {
    // 获取告警信息列表
    *fetchMessages({ payload, callback }, { call, put }) {
      const { code, data: { list } } = yield call(getMessages, payload)
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { messages: list },
        })
        if (callback) {
          callback(list);
        }
      }
      else if (callback) {
        callback();
      }
    },
    // 获取告警信息列表
    *fetchCompanyId({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getCompanyId, payload)
      if (code === 200) {
        if (callback) {
          callback(data);
        }
      }
      else if (callback) {
        callback();
      }
    },
  },
  reducers: {
    // 保存
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
}
