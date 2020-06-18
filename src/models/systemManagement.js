import {
  fetchSystemSetting,
  addSystemCompany,
  updateSystemSetting,
  // 获取登录日志列表
  getLoginLogList,
  // 获取操作日志列表
  getOperationLogList,
} from '@/services/systemManagement';
import { message } from 'antd';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'systemManagement',

  state: {
    systemSetting: defaultData,
    detail: {},
    // 系统日志列表
    loginLogList: {},
    // 操作日志列表
    operationLogList: {},
  },

  effects: {
    // 获取系统设置列表
    *fetchSystemSetting({ payload }, { call, put }) {
      const res = yield call(fetchSystemSetting, payload);
      yield put({
        type: 'saveSetting',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      });
    },
    // 新增系统设置单位
    *addSystemCompany({ payload, callback }, { call }) {
      const res = yield call(addSystemCompany, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 修改系统配置
    *updateSystemSetting({ payload, callback }, { call }) {
      const res = yield call(updateSystemSetting, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取设置详情
    *fetchSettingDetail({ payload, callback }, { call, put }) {
      const res = yield call(fetchSystemSetting, { ...payload, pageNum: 1, pageSize: 0 });
      const detail = res && res.code === 200 && res.data ? res.data.list[0] : {};
      yield put({ type: 'saveDetail', payload: detail });
      callback && callback(detail);
    },
    // 获取登录日志列表
    *getLoginLogList(
      {
        payload: { pageNum, pageSize, startTime, endTime, ...rest },
        callback,
      },
      { call, put }
    ) {
      const response = yield call(getLoginLogList, {
        pageNum,
        pageSize,
        startTime,
        endTime,
        queryStrList: Object.entries(rest)
          .reduce((result, [key, value]) => {
            if (value || value === 0) {
              result.push(`${key}:${value}`);
            }
            return result;
          }, [])
          .join(','),
      });
      const { code, msg, data } = response || {};
      if (code === 200 && data) {
        const loginLogList = {
          ...data,
          list: data.list.map((item, index) => ({
            ...item,
            id: index,
          })),
        };
        yield put({
          type: 'save',
          payload: {
            loginLogList,
          },
        });
        callback && callback(true, loginLogList);
      } else {
        message.error('获取登录日志列表数据失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    // 获取操作日志列表
    *getOperationLogList(
      {
        payload: { pageNum, pageSize, startTime, endTime, ...rest },
        callback,
      },
      { call, put }
    ) {
      const response = yield call(getOperationLogList, {
        pageNum,
        pageSize,
        startTime,
        endTime,
        queryStrList: Object.entries(rest)
          .reduce((result, [key, value]) => {
            if (value || value === 0) {
              result.push(`${key}:${value}`);
            }
            return result;
          }, [])
          .join(','),
      });
      const { code, msg, data } = response || {};
      if (code === 200 && data) {
        const operationLogList = {
          ...data,
          list: data.list.map((item, index) => ({
            ...item,
            id: index,
          })),
        };
        yield put({
          type: 'save',
          payload: {
            operationLogList,
          },
        });
        callback && callback(true, operationLogList);
      } else {
        message.error('获取操作日志列表数据失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    saveSetting(state, action) {
      return {
        ...state,
        systemSetting: action.payload || defaultData,
      };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
