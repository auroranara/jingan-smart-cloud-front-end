import { queryCompanies, deleteCompany, queryCompanyCategories } from '../services/api.js';

export default {
  namespace: 'company',

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
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data.list,
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
      }
    },
    *fetchCategories({ payload }, { call, put }) {
      const response = yield call(queryCompanyCategories, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryCategories',
          payload: response.data.list,
        });
      }
    },
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(deleteCompany, payload);
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
    updateFormData(state, { payload }) {
      return {
        ...state,
        formData: payload,
      };
    },
  },
};
