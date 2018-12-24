import {
  knowledgeTreeAdd,
  getTree,
  deleteTree,
  editTree,
  sortTree,
  getEducationCompanies,
} from '../services/training/knowledgeTree.js';

export default {
  namespace: 'knowledgeTree',

  state: {
    knowledgeTree: [],
    educationCompanies: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
  },

  effects: {
    // 查找重点和非重点单位
    *fetchTree({ payload, success, error }, { call, put }) {
      if (!payload.companyId) {
        yield put({
          type: 'getTree',
          payload: [],
        });
        return;
      }
      const response = yield call(getTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'getTree',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *knowledgeTreeAdd({ payload, success, error }, { call, put }) {
      const response = yield call(knowledgeTreeAdd, payload);
      if (response.code === 200) {
        // yield put({
        //   type: 'knowledgeTreeAdd',
        //   payload: response.data,
        // });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *deleteTree({ payload, success, error }, { call, put }) {
      const response = yield call(deleteTree, payload);
      if (response.code === 200) {
        // yield put({
        //   type: 'getTree',
        //   payload: response.data.list,
        // });
        if (success) {
          success();
        }
      } else if (error) {
        error(response);
      }
    },
    *edit({ payload, success, error }, { call, put }) {
      const response = yield call(editTree, payload);
      if (response.code === 200) {
        // yield put({
        //   type: 'getTree',
        //   payload: response.data.list,
        // });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *sort({ payload, success, error }, { call, put }) {
      const response = yield call(sortTree, payload);
      if (response.code === 200) {
        // yield put({
        //   type: 'getTree',
        //   payload: response.data.list,
        // });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 获取企业列表
    *fetchCompanies({ payload, success, error }, { call, put }) {
      const response = yield call(getEducationCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'educationCompanies',
          payload: response.data,
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
    getTree(state, { payload }) {
      return {
        ...state,
        knowledgeTree: payload,
      };
    },
    educationCompanies(state, { payload }) {
      return {
        ...state,
        educationCompanies: payload,
      };
    },
  },
};
