import {
  queryDangerElementList,
  queryDangerElementSync,
  queryDangerElementDel,
  querySafeRiskList,
  querySafeRiskSync,
  querySafeRiskDel,
} from '../services/twoInformManagement';

/**两单信息 */
export default {
  namespace: 'twoInformManagement',

  state: {
    dangerData: {
      list: [],
      pagination: {},
    },
    safetyData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchDagerList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerElementList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveDangerList',
          payload: data,
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

    *fetchSafetyList({ payload, callback }, { call, put }) {
      const response = yield call(querySafeRiskList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveSafetyList',
          payload: data,
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
  },

  reducers: {
    saveDangerList(state, { payload }) {
      return {
        ...state,
        dangerData: payload,
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
      return {
        ...state,
        safetyData: payload,
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
  },
};
