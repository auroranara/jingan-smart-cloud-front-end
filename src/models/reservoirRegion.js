import {
  queryAreaList,
  queryAreaAdd,
  queryAreaEdit,
  queryAreaDelete,
  queryCompanyNum,
} from '../services/company/reservoirRegion';

export default {
  namespace: 'reservoirRegion',

  state: {
    areaData: {
      list: [],
      pagination: {},
    },
    areaDetail: {
      data: [],
    },
    envirTypeList: [
      { key: '1', value: '一类区' },
      { key: '2', value: '二类区' },
      { key: '3', value: '三类区' },
    ],
    areaCount: {},
  },

  effects: {
    // 库区列表
    *fetchAreaList({ payload, callback }, { call, put }) {
      const response = yield call(queryAreaList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAreaList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    *fetchCount({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyNum, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCount',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增库区
    *fetchAreaAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveAreaAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改库区
    *fetchAreaEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除库区
    *fetchAreaDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    // 库区列表
    saveAreaList(state, { payload }) {
      const {
        data,
        data: { list },
      } = payload;
      return {
        ...state,
        list,
        areaData: data,
      };
    },

    saveCount(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        areaCount: data,
      };
    },

    // 新增库区
    saveAreaAdd(state, { payload }) {
      return {
        ...state,
        areaDetail: payload,
      };
    },

    // 编辑库区
    saveAreaEdit(state, { payload }) {
      return {
        ...state,
        areaDetail: {
          ...state.areaDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        areaDetail: { data: {} },
      };
    },

    // 删除库区
    saveAreaDelete(state, { payload }) {
      const { id } = payload;
      return {
        ...state,
        areaData: {
          ...state.areaData,
          list: state.areaData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
