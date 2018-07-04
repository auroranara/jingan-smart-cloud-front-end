import {
  queryMaintenanceCompanies,
  queryMaintenanceCompany,
  queryMaintenanceCompanyinfo,
  updateMaintenanceCompany,
  addMaintenanceCompany,
  queryCompanyList,
} from '../services/maintenanceCompany.js';

export default {
  namespace: 'accountmanagement',

  state: {
    list: [],
    detail: {},
    pageNum: 1,
    isLast: false,
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data,
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryMaintenanceCompanyinfo, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'queryDetail',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },
    *updateMaintenanceCompanyAsync({ payload, callback }, { call, put }) {
      const response = yield call(updateMaintenanceCompany, payload);
      const { code } = response;
      if (callback) callback(code);
      if (code === 200) {
        yield put({
          type: 'updateMaintenanceCompany',
          payload: response.data,
        });
      }
    },
    *addMaintenanceCompanyAsync({ payload, callback }, { call, put }) {
      const response = yield call(addMaintenanceCompany, payload);
      const { code } = response;
      if (callback) callback(code);
      if (code === 200) {
        yield put({
          type: 'addMaintenanceCompany',
          payload: response.data,
        });
      }
    },
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyList, payload);
      const { code } = response;
      if (callback) callback(code);
      if (response.code === 200) {
        yield put({
          type: 'queryCompanyList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    query(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list,
        pageNum: 1,
        isLast: pageNum * pageSize >= total,
      };
    },
    appendList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    updateFormData(state, { payload }) {
      return {
        ...state,
        formData: payload,
      };
    },
    updateMaintenanceCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    addMaintenanceCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    queryCompanyList(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },
  },
};
