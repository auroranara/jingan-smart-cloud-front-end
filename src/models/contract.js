// import { queryContractList, queryStatusList, queryContract, addContract, queryMaintanceList, queryServiceList } from '../services/contract/contract.js';

export default {
  namespace: 'contract',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 1,
        pageNum: 1,
      },
    },
    isLast: false,
    statusList: [],
    detail: {},
    maintanceList: [{
      id: 1,
      name: '陆华',
    }],
    serviceList: [],
  },

  effects: {
    /* 获取合同列表 */
    *fetchList({ payload, success, error }, { put }) {
      // const response = yield call(queryContractList, payload);
      const response = {
        code: 200,
        data: {
          list: [{
            id: 1,
            name: '陆华',
            number: 'x00001',
            safetyName: '陆华',
            safetyPhone: '15911111111',
          }],
          pagination: {
            total: 2,
            pageSize: payload.pageSize,
            pageNum: payload.pageNum,
          },
        },
      };
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
    *appendList({ payload, success, error }, { put }) {
      // const response = yield call(queryContractList, payload);
      const response = {
        code: 200,
        data: {
          list: [{
            id: 2,
            name: '虫二',
            number: 'x00001',
          }],
          pagination: {
            total: 2,
            pageSize: payload.pageSize,
            pageNum: payload.pageNum,
          },
        },
      };
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
    *fetchStatusList({ payload, success, error }, { put }) {
      // const response = yield call(queryStatusList, payload);
      const response = {
        code: 200,
        data: {
          list: [{
            id: 1,
            label: '已过期',
          }, {
            id: 2,
            label: '服务中',
          }, {
            id: 3,
            label: '即将过期',
          }, {
            id: 4,
            label: '未开始',
          }],
          pagination: {
            total: 0,
            pageSize: payload.pageSize,
            pageNum: payload.pageNum,
          },
        },
      };
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
    *fetchContract({ payload, success, error }, { put }) {
      // const response = yield call(queryContract, payload);
      const response = {
        code: 200,
        data: {
          id: payload.id,
          name: '陆华',
          number: 'x00001',
        },
      };
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
    *insertContract({ payload, success, error }, { put }) {
      // const response = yield call(addContract, payload);
      const response = {
        code: 200,
        data: {
          id: payload.id,
          name: '陆华',
          number: 'x00001',
        },
      };
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
    *updateContract({ payload, success, error }, { put }) {
      // const response = yield call(addContract, payload);
      const response = {
        code: 200,
        data: {
          id: payload.id,
          name: '陆华',
          number: 'x00001',
        },
      };
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
    *fetchMaintanceList({ payload, success, error }, { put }) {
      // const response = yield call(queryMaintanceList, payload);
      const response = {
        code: 200,
        data: {
          list: [],
          pagination: {
            total: 0,
            pageSize: payload.pageSize,
            pageNum: payload.pageNum,
          },
        },
      };
      if (response.code === 200) {
        yield put({
          type: 'queryMaintanceList',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchServiceList({ payload, success, error }, { put }) {
      // const response = yield call(queryServiceList, payload);
      const response = {
        code: 200,
        data: {
          list: [],
          pagination: {
            total: 0,
            pageSize: payload.pageSize,
            pageNum: payload.pageNum,
          },
        },
      };
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
    queryMaintanceList(state, { payload }) {
      return {
        ...state,
        maintanceList: payload,
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
