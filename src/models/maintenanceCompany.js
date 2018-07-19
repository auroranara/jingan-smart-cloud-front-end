import {
  queryMaintenanceCompanies,
  deleteMaintenanceCompany,
  queryMaintenanceCompany,
  queryMaintenanceCompanyinfo,
  updateMaintenanceCompany,
  addMaintenanceCompany,
  queryCompanyList,
  queryServiceUnit,
} from '../services/maintenanceCompany.js';

export default {
  namespace: 'maintenanceCompany',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    list: [],
    detail: {},
    categories: [],
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
    // 维保单位列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryMaintenanceCompanyList',
          payload: response.data,
        });
      }
    },
    // 查询维保单位列表
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
      }
    },
    // 删除维保单位信息
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
      }
      if (callback) callback(response);
    },
    //  查看指定维保单位信息
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
    // 修改维保单位信息
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
    // 新增维保单位信息
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
    // 查询企业列表
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
    // 根据维保单位id查询服务单位列表
    *fetchServiceUnit({ payload }, { call, put }) {
      const response = yield call(queryServiceUnit, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'queryServiceUnit',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    // 维保单位列表
    queryMaintenanceCompanyList(
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
    // 查询维保单位列表
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
    //  查看指定维保单位信息
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    // 删除维保单位信息
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
    // 修改维保单位信息
    updateMaintenanceCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // 新增维保单位信息
    addMaintenanceCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // 查询企业列表
    queryCompanyList(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },
    // 根据维保单位id查询服务单位列表
    queryServiceUnit(
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
  },
};
