import {
  queryIndexManageList,
  querIndexManageAdd,
  queryIndexManageEdit,
  queryIndexManageDelete,
} from '../services/targetResponsibility.js';

export default {
  namespace: 'targetResponsibility',
  state: {
    indexData: {
      list: [],
      pagination: {},
    },
    dutyMajorList: [
      {
        key: '1',
        value: '单位',
      },
      {
        key: '2',
        value: '部门',
      },
      {
        key: '3',
        value: '个人',
      },
    ],
  },

  effects: {
    /** 安全生产指标 */
    // 列表
    *fetchIndexManagementList({ payload, callback }, { call, put }) {
      const response = yield call(queryIndexManageList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveIndexList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    // 新建
    *fetchIndexManagementAdd({ payload, callback }, { call }) {
      const response = yield call(querIndexManageAdd, payload);
      if (callback) callback(response);
    },
    // 修改
    *fetchIndexManagementEdit({ payload, callback }, { call }) {
      const response = yield call(queryIndexManageEdit, payload);
      if (callback) callback(response);
    },
    // 删除库房
    *fetchIndexManagementDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryIndexManageDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveIndexDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveIndexList(state, { payload }) {
      const { data } = payload;
      console.log('data', data);
      return {
        ...state,
        indexData: data,
      };
    },

    saveIndexDel(state, { payload: id }) {
      return {
        ...state,
        indexData: {
          ...state.indexData,
          list: state.indexData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
