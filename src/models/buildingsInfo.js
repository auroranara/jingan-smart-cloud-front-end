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
    list: [],
    pageNum: 1,
    buildingData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    // 建筑物类型
    buildingTypes: [],
    // 火灾危险性分类
    fireDangerTypes: [],
    // 耐火等级
    fireRatings: [],
    // 建筑结构
    floorNumbers: [],
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
        payload: { type, key },
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
            result: response.result,
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
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        data: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 获取字典
    saveDict(state, { payload }) {
      console.log('payload', payload);

      const { result } = payload;
      return {
        ...state,
        result,
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
        buildingData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
  },
};
