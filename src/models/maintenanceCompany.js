import {
  queryMaintenanceCompanies,
  deleteMaintenanceCompany,
  queryMaintenanceCompany,
  queryMaintenanceCompanyinfo,
  updateMaintenanceCompany,
  addMaintenanceCompany,
} from '../services/maintenanceCompany.js';

export default {
  namespace: 'maintenanceCompany',

  state: {
    list: [],
    detail: {},
    categories: [],
    formData: {
      name: undefined,
      practicalAddress: undefined,
      industryCategory: undefined,
    },
    isLast: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data.list,
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
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(deleteMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryMaintenanceCompanyinfo, payload);
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
  },

  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    appendList(
      state,
      {
        payload: {
          list,
          pagination: { pageIndex, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        isLast: pageIndex * pageSize >= total,
      };
    },
    queryCategories(state, { payload }) {
      return {
        ...state,
        categories: payload,
      };
    },
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
    queryMaintenanceCompanyDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
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
  },
};
