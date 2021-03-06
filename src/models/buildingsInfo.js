import {
  queryCompanyList,
  queryDict,
  queryBuildingsList,
  addBuildings,
  editBuildings,
  deleteBuildings,
  queryFloorList,
  addFloor,
  editFloor,
  deleteFloor,
  queryFloorNumber,
  queryModelList,
} from '../services/personnelPosition/buildingsInfo';

export default {
  namespace: 'buildingsInfo',

  state: {
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
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
        buildingType: undefined,
        floorNumber: undefined,
        fireDangerType: undefined,
        fireRating: undefined,
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
        pageSize: 20,
        pageNum: 1,
      },
    },
    floorDetail: {
      data: {
        floorName: undefined,
        floorNumber: undefined,
      },
    },
    allFloorNumberLists: [],
    floorNumberLists: [],
    floorIndexList: [
      {
        key: '1',
        value: '地下2楼',
      },
      {
        key: '2',
        value: '地下1楼',
      },
      {
        key: '3',
        value: '1楼',
      },
      {
        key: '4',
        value: '2楼',
      },
      {
        key: '5',
        value: '3楼',
      },
      {
        key: '6',
        value: '4楼',
      },
      {
        key: '7',
        value: '5楼',
      },
      {
        key: '8',
        value: '6楼',
      },
      {
        key: '9',
        value: '7楼',
      },
      {
        key: '10',
        value: '8楼',
      },
      {
        key: '11',
        value: '9楼',
      },
      {
        key: '12',
        value: '10楼',
      },
      {
        key: '13',
        value: '11楼',
      },
      {
        key: '14',
        value: '12楼',
      },
      {
        key: '15',
        value: '13楼',
      },
      {
        key: '16',
        value: '14楼',
      },
      {
        key: '17',
        value: '15楼',
      },
    ],
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
          success(response.data);
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
          success(response.data.list[0]);
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

    // 获取楼层编号
    *fetchFloorNumber({ payload, success, error }, { call, put }) {
      const response = yield call(queryFloorNumber, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFloorNumber',
          payload: {
            data: response.data,
          },
        });
      }
    },

    // 删除建筑
    *removeBuilding({ payload, success, error }, { call, put }) {
      const response = yield call(deleteBuildings, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 楼层列表
    *fetchFloorList({ payload, success, error }, { call, put }) {
      const response = yield call(queryFloorList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFloorList',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 新增楼层
    *insertFloor({ payload, success, error }, { call, put }) {
      const response = yield call(addFloor, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAddFloor',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑楼层
    *editFloor({ payload, success, error }, { call, put }) {
      const response = yield call(editFloor, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveEditFloor',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除楼层
    *removeFloor({ payload, callback }, { call, put }) {
      const response = yield call(deleteFloor, payload);
      if (response.code === 200) {
        yield put({
          type: 'deleteFloor',
          payload: payload.id,
        });
        if (callback) callback(response);
      }
    },

    // 企业列表弹出框
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(queryModelList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveModelList',
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

    // 楼层编号
    saveFloorNumber(
      state,
      {
        payload: {
          data: { allFloorNumberList, floorNumberList },
        },
      }
    ) {
      return {
        ...state,
        allFloorNumberLists: allFloorNumberList,
        floorNumberLists: floorNumberList,
      };
    },

    // 删除建筑
    delete(state, { payload: id }) {
      return {
        ...state,
        buildingData: {
          ...state.buildingData,
          list: state.buildingData.list.filter(item => item.id !== id),
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
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

    // 新增楼层
    saveAddFloor(state, { payload }) {
      return {
        ...state,
        floorDetail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 编辑楼层
    saveEditFloor(state, { payload }) {
      return {
        ...state,
        floorDetail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearFloorDetail(state) {
      return {
        ...state,
        floorDetail: { data: {} },
      };
    },

    // 删除楼层
    deleteFloor(state, { payload: id }) {
      return {
        ...state,
        floorData: {
          ...state.floorData,
          list: state.floorData.list.filter(item => item.id !== id),
        },
      };
    },

    // 企业弹出框
    saveModelList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        modal: payload,
      };
    },
  },
};
