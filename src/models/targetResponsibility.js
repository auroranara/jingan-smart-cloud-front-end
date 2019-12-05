import {
  queryIndexManageList,
  queryIndexManageAdd,
  queryIndexManageEdit,
  queryIndexManageDelete,
  queryTargetSettingList,
  queryTargetSettingAdd,
  queryTargetSettingEdit,
  queryTargetSettingDelete,
} from '../services/targetResponsibility.js';

export default {
  namespace: 'targetResponsibility',
  state: {
    indexData: {
      list: [],
      pagination: { total: 0, pageNum: 18, pageSize: 1 },
    },
    settingData: {
      list: [],
      pagination: { total: 0, pageNum: 18, pageSize: 1 },
    },
    settingDetail: {
      data: [],
    },
    dutyMajorList: [
      {
        key: '1',
        value: '单位',
      },
      {
        key: '2',
        value: '部门',
      },
      {
        key: '3',
        value: '个人',
      },
    ],
    targetValueList: [
      {
        key: '1',
        value: '≥',
      },
      {
        key: '2',
        value: '≤',
      },
    ],
  },

  effects: {
    /** 安全生产指标 */
    // 列表
    *fetchIndexManagementList({ payload, callback }, { call, put }) {
      const response = yield call(queryIndexManageList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveIndexList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    // 新建
    *fetchIndexManagementAdd({ payload, callback }, { call }) {
      const response = yield call(queryIndexManageAdd, payload);
      if (callback) callback(response);
    },
    // 修改
    *fetchIndexManagementEdit({ payload, callback }, { call }) {
      const response = yield call(queryIndexManageEdit, payload);
      if (callback) callback(response);
    },
    // 删除
    *fetchIndexManagementDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryIndexManageDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveIndexDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    /** 目标责任制定实施 */

    // 列表
    *fetchSettingList({ payload, callback }, { call, put }) {
      const response = yield call(queryTargetSettingList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveSettingList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },

    // 新增
    *fetchSettingAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryTargetSettingAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveSettingAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改
    *fetchSettingEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryTargetSettingEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSettingEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 删除
    *fetchSettingtDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryTargetSettingDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSettingDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveIndexList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        indexData: data,
      };
    },

    saveIndexDel(state, { payload: id }) {
      return {
        ...state,
        indexData: {
          ...state.indexData,
          list: state.indexData.list.filter(item => item.id !== id),
        },
      };
    },

    saveSettingList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        settingData: data,
      };
    },

    saveSettingAdd(state, { payload }) {
      return {
        ...state,
        settingDetail: payload,
      };
    },

    saveSettingEdit(state, { payload }) {
      return {
        ...state,
        settingDetail: {
          ...state.settingDetail,
          data: payload,
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        settingDetail: { data: {} },
      };
    },

    saveSettingDel(state, { payload: id }) {
      return {
        ...state,
        settingData: {
          ...state.settingData,
          list: state.settingData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
