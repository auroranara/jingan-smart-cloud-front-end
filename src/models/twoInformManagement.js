import {
  /**两单信息 */
  queryDangerElementList,
  queryDangerElementSync,
  queryDangerElementDel,
  queryBindDangerCheck,
  querySafeRiskList,
  querySafeRiskSync,
  querySafeRiskDel,
  queryBindSafetyControl,
  querySafetyImport,
  /** 安全承诺公告 */
  querySafetyPromiseList,
  querSafetyPromiseAdd,
  querySafetyPromiseEdit,
  querySafetyPromiseDelete,
} from '../services/twoInformManagement';

export default {
  namespace: 'twoInformManagement',

  state: {
    dangerData: {
      list: [],
      pagination: {},
      msg: '',
    },
    safetyData: {
      list: [],
      pagination: {},
    },
    safetyPromiseData: {
      list: [],
      pagination: {},
    },
    dangerBindData: {
      data: [],
    },
    safetyPromiseDetail: {
      data: [],
    },
    safetyBindData: {
      data: [],
    },
  },

  effects: {
    // 两单信息管理
    *fetchDagerList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerElementList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDangerList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    *fetchDangerSync({ success, error }, { call }) {
      const response = yield call(queryDangerElementSync);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },

    *fetchDangerDel({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerElementDel, payload);
      if (response.code === 200) {
        yield put({ type: 'removeDanger', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchBindDangerCheck({ payload, success, error }, { call, put }) {
      const response = yield call(queryBindDangerCheck, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveBindDangerCheck',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    *fetchSafetyList({ payload, callback }, { call, put }) {
      const response = yield call(querySafeRiskList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafetyList',
          payload: response,
        });
      }
      if (callback) callback(response.data);
    },

    *fetchSafetySync({ success, error }, { call }) {
      const response = yield call(querySafeRiskSync);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },

    *fetchSafetyDel({ payload, success, error }, { call, put }) {
      const response = yield call(querySafeRiskDel, payload);
      if (response.code === 200) {
        yield put({ type: 'removeSafety', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchBindSafetyControl({ payload, success, error }, { call, put }) {
      const response = yield call(queryBindSafetyControl, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveBindSafetyControl',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 导入安全风险清单
    *fetchDataImport({ payload, success, error }, { call }) {
      const response = yield call(querySafetyImport, payload);
      if (response.code === 200) {
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 安全承诺公告
    *fetchSafetyPromiseList({ payload, callback }, { call, put }) {
      const response = yield call(querySafetyPromiseList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafetyPromiseList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    *fetchSafetyPromiseAdd({ payload, success, error }, { call, put }) {
      const response = yield call(querSafetyPromiseAdd, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafetyPromiseAdd',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchSafetyPromiseEdit({ payload, success, error }, { call, put }) {
      const response = yield call(querySafetyPromiseEdit, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafetyPromiseEdit',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    *fetchSafetyPromiseDel({ payload, success, error }, { call, put }) {
      const response = yield call(querySafetyPromiseDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSafetyPromiseDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    // 两单信息管理
    saveDangerList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msgDanger: msg,
        dangerData: data,
      };
    },

    removeDanger(state, { payload: id }) {
      return {
        ...state,
        dangerData: {
          ...state.dangerData,
          list: state.dangerData.list.filter(item => item.id !== id),
        },
      };
    },

    saveSafetyList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msgSafety: msg,
        safetyData: data,
      };
    },

    removeSafety(state, { payload: id }) {
      return {
        ...state,
        safetyData: {
          ...state.safetyData,
          list: state.safetyData.list.filter(item => item.id !== id),
        },
      };
    },

    saveBindDangerCheck(state, { payload }) {
      return {
        ...state,
        dangerBindData: {
          ...state.dangerBindData,
          data: payload,
        },
      };
    },

    saveBindSafetyControl(state, { payload }) {
      return {
        ...state,
        safetyBindData: {
          ...state.safetyBindData,
          data: payload,
        },
      };
    },

    // 安全承诺公告
    saveSafetyPromiseList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        safetyPromiseData: data,
      };
    },

    saveSafetyPromiseAdd(state, { payload }) {
      return {
        ...state,
        safetyPromiseDetail: payload,
      };
    },

    saveSafetyPromiseEdit(state, { payload }) {
      return {
        ...state,
        safetyPromiseDetail: {
          ...state.safetyPromiseDetail,
          data: payload,
        },
      };
    },

    clearSafetyPromiseDetail(state) {
      return {
        ...state,
        safetyPromiseDetail: { data: [] },
      };
    },

    saveSafetyPromiseDel(state, { payload: id }) {
      return {
        ...state,
        safetyPromiseData: {
          ...state.safetyPromiseData,
          list: state.safetyPromiseData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
