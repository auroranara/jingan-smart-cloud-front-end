import {
  queryCompanies,
  deleteCompany,
  queryDict,
  queryCompany,
  addCompany,
  updateCompany,
  queryMaintenanceCompanies,
} from '../services/company/company.js';

export default {
  namespace: 'company',

  state: {
    list: [],
    industryCategories: [],
    economicTypes: [],
    companyStatuses: [],
    scales: [],
    licenseTypes: [],
    formData: {
      name: undefined,
      practicalAddress: undefined,
      industryCategory: undefined,
    },
    pageNum: 1,
    isLast: false,
    detail: {
      data: {
        province: undefined,
        city: undefined,
        district: undefined,
        town: undefined,
        businessScope: undefined,
        code: undefined,
        companyIchnography: undefined,
        companyStatus: undefined,
        createDate: undefined,
        economicType: undefined,
        groupName: undefined,
        industryCategory: undefined,
        latitude: undefined,
        licenseType: undefined,
        longitude: undefined,
        maintenanceContract: undefined,
        maintenanceId: undefined,
        name: undefined,
        practicalAddress: undefined,
        registerAddress: undefined,
        scale: undefined,
      },
    },
    modal: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data,
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
    *fetchDict({ payload }, { call, put }) {
      const response = yield call(queryDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryDict',
          payload: {
            type: payload.type,
            list: response.data.list,
          },
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
    *fetchCompany({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryCompany',
          payload: response.data,
        });
      }
    },
    *insertCompany({ payload, success, error }, { call }) {
      const response = yield call(addCompany, payload);
      if (response.code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(response.error);
      }
    },
    *editCompany({ payload }, { call, put }) {
      const response = yield call(updateCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateCompany',
          payload: response.data,
        });
      }
    },
    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryModalList',
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
    queryDict(state, { payload }) {
      return {
        ...state,
        [payload.type]: payload.list,
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
    queryCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // addCompany(state, { payload }) {
    //   return {
    //     ...state,
    //     detail: {
    //       ...state.detail,
    //       data: payload,
    //     },
    //   };
    // },
    updateCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    queryModalList(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },
  },
};
