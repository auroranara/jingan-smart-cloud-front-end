// import { queryContractList, queryStatusList } from '../services/contract/contract.js';

export default {
  namespace: 'contract',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 1,
        pageNum: 24,
      },
    },
    isLast: false,
    statusList: [],
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
    /* 获取单位状态列表 */
    queryStatusList(state, { payload }) {
      return {
        ...state,
        statusList: payload,
      };
    },
  },
}
