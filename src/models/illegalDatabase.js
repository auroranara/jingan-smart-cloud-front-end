import {
  queryIllegalList,
  queryIllegalType,
  addIllegal,
  updateIllegal,
  deleteIllegal,
  queryDtoLIst,
} from '../services/lawEnforcement/illegal.js';

import { queryLawsOptions, queryLawsList } from '../services/lawEnforcement/laws.js';

/* 违法行为库 */
export default {
  namespace: 'illegalDatabase',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    // 业务分类
    businessTypes: [],
    // 所属法律法规
    lawTypes: [],
    // 所属类别
    typeCodes: [],
    detail: {},
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    checkModal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    // 列表
    *fetchIllegalList({ payload }, { call, put }) {
      const response = yield call(queryIllegalList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    // 模态框
    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryLawsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveModalList',
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
    // 获取所属类别
    *fetchType({ success, error }, { call, put }) {
      const response = yield call(queryIllegalType);
      if (response.code === 200) {
        yield put({
          type: 'queryType',
          payload: {
            type: 'typeCodes',
            list: response.data.list,
          },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 获取检查内容
    *fetchDtoList({ payload }, { call, put }) {
      const response = yield call(queryDtoLIst, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryDtoList',
          payload: response.data,
        });
      }
    },
    // 新增
    *insertIllegal({ payload, success, error }, { call, put }) {
      const response = yield call(addIllegal, payload);
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
    *editIllegal({ payload, success, error }, { call, put }) {
      const response = yield call(updateIllegal, payload);
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

    *deleteLaws({ payload, callback }, { call }) {
      const response = yield call(deleteIllegal, payload);
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
    // 模态框
    saveModalList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        modal: payload,
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

    // 获取所属类别
    queryType(
      state,
      {
        payload: { type, list },
      }
    ) {
      return {
        ...state,
        [type]: list,
      };
    },

    // 获取检查内容
    queryDtoList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        checkModal: payload,
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
    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
