import {
  queryDivisionList,
  addDivision,
  editDivision,
  deleteDivision,
  queryDivisionDetail,
} from '../services/company/company.js';

export default {
  namespace: 'unitDivision',

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
    detail: {
      data: {
        name: undefined,
        address: undefined,
        chargeName: undefined,
        phone: undefined,
        unitId: undefined,
      },
    },
  },

  effects: {
    // 获取单位分部列表
    *fetchDivisionList({ payload, success, error }, { call, put }) {
      const response = yield call(queryDivisionList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDivisionList',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 追加列表
    *appendfetch({ payload }, { call, put }) {
      const response = yield call(queryDivisionList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveLoadMoreList',
          payload: response.data,
        });
      }
    },

    // 新增单位分部
    *insertDivision({ payload, success, error }, { call, put }) {
      const response = yield call(addDivision, payload);
      yield put({ type: 'addUnitDivision', payload: response.data });
      if (success) {
        success();
      } else if (error) {
        error(response.msg);
      }
    },

    // 获取单位分部详情
    *fetchDivisionDetail({ payload, success, error }, { call, put }) {
      const response = yield call(queryDivisionDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryDetail',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑建筑
    *editUnitDivision({ payload, success, error }, { call, put }) {
      const response = yield call(editDivision, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateDivision',
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
    *removeDivision({ payload, success, error }, { call, put }) {
      const response = yield call(deleteDivision, payload);
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
  },

  reducers: {
    // 获取建筑物单位列表
    saveDivisionList(state, { payload }) {
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

    // 新增建筑
    addUnitDivision(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 获取详情
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 编辑建筑
    updateDivision(state, { payload }) {
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
          ...state.buildingData,
          list: state.buildingData.list.filter(item => item.id !== id),
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
      };
    },
  },
};
