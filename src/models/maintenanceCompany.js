import {
  queryMaintenanceCompanies,
  delateMaintenanceCompany,
  queryMaintenanceCompany,
  queryMaintenanceCompanyDetail,
} from '../services/api.js';

export default {
  namespace: 'maintenanceCompany',

  state: {
    list: [],
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
      const response = yield call(delateMaintenanceCompany, payload);
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

    // 获取维保单位详情
    *fetchMaintenanceCompany({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanyDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryMaintenanceCompanyDetail',
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
  },
};
