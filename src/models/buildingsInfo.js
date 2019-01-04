import {
  queryCompanyList,
  queryDict,
  queryBuildingsList,
  addBuildings,
  editBuildings,
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
    *fetchDict({ payload, success, error }, { call, put }) {
      const response = yield call(queryDict, payload);
      if (response.error.code === 200) {
        yield put({
          type: 'saveDict',
          payload: {
            [payload.type]: response.result,
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

    // 查询建筑物信息列表
    *appendBuildingList({ payload }, { call, put }) {
      const response = yield call(queryBuildingsList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveLoadBuildingList',
          payload: response.data,
        });
      }
    },

    // 新增建筑
    *insertBuilding({ payload, success, error }, { call, put }) {
      const response = yield call(addBuildings, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addBuilding', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑建筑
    *editLaws({ payload, success, error }, { call, put }) {
      const response = yield call(editBuildings, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateBuilding',
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
      return {
        ...state,
        ...payload,
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

    // 查询建筑物信息列表
    saveLoadBuildingList(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        buildingData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },
  },
};
