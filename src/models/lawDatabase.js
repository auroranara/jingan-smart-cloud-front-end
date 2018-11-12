import {
  queryLawsList,
  queryLawsOptions,
  addLaws,
  queryLawsDetail,
  updateLaws,
  deleteLaws,
} from '../services/lawEnforcement/laws.js';

/* 法律法规库 */
export default {
  namespace: 'lawDatabase',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    businessTypes: [],
    lawTypes: [],
    detail: {},
  },

  effects: {
    // 列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryLawsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    // 初始化选项
    *fetchOptions({ success, error }, { call, put }) {
      const response = yield call(queryLawsOptions);
      if (response.code === 200) {
        yield put({
          type: 'queryOptions',
          payload: {
            data: response.data,
          },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 新增
    *insertLaws({ payload, success, error }, { call, put }) {
      const response = yield call(addLaws, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addLaws', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 编辑
    *editLaws({ payload, success, error }, { call, put }) {
      console.log(payload);
      const response = yield call(updateLaws, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateLaws',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查看
    *fetchLawsDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryLawsDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
        if (callback) callback(response);
      }
    },

    *deleteLaws({ payload, callback }, { call }) {
      const response = yield call(deleteLaws, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    // 列表
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },
    // 初始化选项
    queryOptions(
      state,
      {
        payload: {
          data: { businessType, lawType },
        },
      }
    ) {
      return {
        ...state,
        businessTypes: businessType,
        lawTypes: lawType,
      };
    },
    // 新增
    addLaws(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    // 编辑
    updateLaws(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // 查看
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
