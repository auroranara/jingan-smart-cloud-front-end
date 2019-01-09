import {
  queryCompanyList,
  queryDict,
  queryBuildingsList,
  addBuildings,
  editBuildings,
  deleteBuildings,
  queryFloorList,
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
    detail: {
      data: {
        buildingTypeName: undefined,
        buildingName: undefined,
        floorNumberName: undefined,
        fireDangerTypeName: undefined,
        buildingArea: undefined,
        fireRatingName: undefined,
        floorLevel: undefined,
      },
    },
    floorData: {
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
      if (response.code === 200) {
        yield put({
          type: 'saveDict',
          payload: {
            [payload.type]: response.data.list,
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
      console.log('payloadpayload', payload);
      const response = yield call(addBuildings, payload);
      const { data } = response;
      yield put({ type: 'addBuilding', payload: data });
      if (success) {
        success();
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑建筑
    *editBuilding({ payload, success, error }, { call, put }) {
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

    // 删除建筑
    *removeBuilding({ payload, callback }, { call, put }) {
      const response = yield call(deleteBuildings, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (callback) callback(response);
      }
    },

    // 楼层列表
    *fetchFloorList({ payload }, { call, put }) {
      const response = yield call(queryFloorList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFloorList',
          payload: response.data,
        });
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

    // 新增建筑
    addBuilding(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 编辑建筑
    updateBuilding(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 删除建筑
    delete(state, { payload: id }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },

    // 楼层列表
    saveFloorList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        floorData: payload,
      };
    },
  },
};
