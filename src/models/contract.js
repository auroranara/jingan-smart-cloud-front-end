import { queryContractList, queryStatusList, queryContract, addContract, queryMaintenanceList, queryServiceList, editContract } from '../services/contract/contract.js';

export default {
  namespace: 'contract',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    isLast: false,
    statusList: [],
    detail: {},
    maintenanceList: [],
    serviceList: [],
  },

  effects: {
    /* 获取合同列表 */
    *fetchList({ payload, success, error }, { call, put }) {
      const response = yield call(queryContractList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 追加维保合同列表 */
    *appendList({ payload, success, error }, { call, put }) {
      const response = yield call(queryContractList, payload);
      if (response.code === 200) {
        yield put({
          type: 'pushList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 获取企业状态列表 */
    *fetchStatusList({ payload, success, error }, { call, put }) {
      const response = yield call(queryStatusList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryStatusList',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 获取合同详情 */
    *fetchContract({ payload, success, error }, { call, put }) {
      const response = yield call(queryContract, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryContract',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 新增合同 */
    *insertContract({ payload, success, error }, { call, put }) {
      const response = yield call(addContract, payload);
      if (response.code === 200) {
        yield put({
          type: 'addContract',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 修改合同 */
    *updateContract({ payload, success, error }, { call, put }) {
      const response = yield call(editContract, payload);
      if (response.code === 200) {
        yield put({
          type: 'editContract',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchMaintenanceList({ payload, success, error }, { call, put }) {
      const response = yield call(queryMaintenanceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryMaintenanceList',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchServiceList({ payload, success, error }, { call, put }) {
      const response = yield call(queryServiceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryServiceList',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    /* 获取合同列表 */
    queryList(state, { payload }) {
      const { pagination: { pageNum, pageSize, total } } = payload;
      return {
        ...state,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
    /* 追加合同列表 */
    pushList(state, { payload: { list, pagination } }) {
      const { pageNum, pageSize, total } = pagination;
      return {
        ...state,
        data: {
          list: state.data.list.concat(list),
          pagination,
        },
        isLast: pageNum * pageSize >= total,
      };
    },
    /* 获取单位状态列表 */
    queryStatusList(state, { payload }) {
      return {
        ...state,
        statusList: payload,
      };
    },
    /* 获取合同详情 */
    queryContract(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    /* 新增合同 */
    addContract(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    /* 编辑合同 */
    editContract(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    /* 清空合同 */
    clearDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
    /* 获取维保单位列表 */
    queryMaintenanceList(state, { payload }) {
      return {
        ...state,
        maintenanceList: payload,
      };
    },
    /* 获取维保单位列表 */
    queryServiceList(state, { payload }) {
      return {
        ...state,
        serviceList: payload,
      };
    },
  },
}
