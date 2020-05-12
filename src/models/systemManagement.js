import {
  fetchSystemSetting,
  addSystemCompany,
  updateSystemSetting,
} from '@/services/systemManagement';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'systemManagement',

  state: {
    systemSetting: defaultData,
    detail: {},
  },

  effects: {
    // 获取系统设置列表
    *fetchSystemSetting ({ payload }, { call, put }) {
      const res = yield call(fetchSystemSetting, payload);
      yield put({
        type: 'saveSetting',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 新增系统设置单位
    *addSystemCompany ({ payload, callback }, { call }) {
      const res = yield call(addSystemCompany, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 修改系统配置
    *updateSystemSetting ({ payload, callback }, { call }) {
      const res = yield call(updateSystemSetting, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取设置详情
    *fetchSettingDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchSystemSetting, { ...payload, pageNum: 1, pageSize: 0 });
      const detail = res && res.code === 200 && res.data ? res.data.list[0] : {};
      yield put({ type: 'saveDetail', payload: detail });
      callback && callback(detail);
    },
  },

  reducers: {
    saveSetting(state, action) {
      return {
        ...state,
        systemSetting: action.payload || defaultData,
      }
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
}
