import {
  queryCompanyList,
  queryDict,
  queryBuildingsList,
} from '../services/personnelPosition/buildingsInfo';

export default {
  namespace: 'buildingsInfo',

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
    pageNum: 1,
    buildingData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
  },

  effects: {
    // 获取建筑物单位列表
    *fetchCompanyList({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanyList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查询列表
    *appendfetch({ payload }, { call, put }) {
      const response = yield call(queryCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveLoadMoreList',
          payload: response.data,
        });
      }
    },

    // 获取字典
    *fetchDict(
      {
        payload: { type, id },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(queryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'saveDict',
          payload: {
            id,
            list: response.result,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 获取建筑物信息列表
    *fetchBuildingList({ payload, success, error }, { call, put }) {
      const response = yield call(queryBuildingsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveBuildingList',
          payload: response.data,
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
    // 获取建筑物单位列表
    saveCompanyList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 查询建筑物列表
    saveLoadMoreList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list: [...state.list, ...list],
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 获取字典
    saveDict(
      state,
      {
        payload: { id, result },
      }
    ) {
      return {
        ...state,
        [id]: result,
      };
    },
    // 获取建筑物信息列表
    saveBuildingList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        buildingData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
  },
};
