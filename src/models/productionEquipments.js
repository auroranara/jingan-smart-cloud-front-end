import {
  queryProductEquipList,
  queryProductEquipAdd,
  queryProductEquipEdit,
  queryProductEquipDelete,
  fetchHighRiskProcessList,
} from '../services/productionEquipments.js';

export default {
  namespace: 'productionEquipments',

  state: {
    proData: {
      list: [],
      pagination: { total: 0, pageNum: 18, pageSize: 1 },
    },
    proDetail: {
      data: [],
    },
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    // 高危工艺流程
    highRiskProcess: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 列表
    *fetchProEquipList({ payload, callback }, { call, put }) {
      const response = yield call(queryProductEquipList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveProList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },

    // 新增
    *fetchProEquipAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryProductEquipAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveProAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改
    *fetchProEquipEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryProductEquipEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveProEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除
    *fetchProEquipDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryProductEquipDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveProDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 获取高危工艺流程列表
    *fetchHighRiskProcessList({ payload }, { call, put }) {
      const res = yield call(fetchHighRiskProcessList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveHighData',
          payload: { highRiskProcess: res.data },
        });
      }
    },
  },

  reducers: {
    saveProList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msg,
        proData: data,
      };
    },

    saveProAdd(state, { payload }) {
      return {
        ...state,
        proDetail: payload,
      };
    },

    saveProEdit(state, { payload }) {
      return {
        ...state,
        proDetail: {
          ...state.proDetail,
          data: payload,
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        proDetail: { data: {} },
      };
    },

    saveProDel(state, { payload: id }) {
      return {
        ...state,
        proData: {
          ...state.proData,
          list: state.proData.list.filter(item => item.id !== id),
        },
      };
    },

    saveHighData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
