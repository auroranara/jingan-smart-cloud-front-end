import {
  querySafeFacilitiesList,
  querySafeFacilitiesAdd,
  querySafeFacilitiesEdit,
  querySafeFacilitiesDelete,
} from '../services/company/reservoirRegion';
export default {
  namespace: 'safeFacilities',

  state: {
    safeFacData: {
      list: [],
      pagination: {},
    },
    safeFacDetail: {
      data: [],
    },
    categoryList: [
      {
        value: '1',
        label: '预防事故设施',
        children: [
          {
            value: '1',
            label: '监测、报警设施',
          },
        ],
      },
    ],
    facNameList: [
      {
        key: '1',
        label: '压力表',
      },
      {
        key: '2',
        label: '温度计',
      },
      {
        key: '3',
        label: '液位仪',
      },
    ],
  },

  effects: {
    // 安全设施列表
    *fetchSafeFacList({ payload, callback }, { call, put }) {
      const response = yield call(querySafeFacilitiesList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafeFacList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 安全设施新增
    *fetchSafeFacAdd({ payload, success, error }, { call, put }) {
      const response = yield call(querySafeFacilitiesAdd, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafeFacAdd',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 安全设施编辑
    *fetchSafeFacEdit({ payload, success, error }, { call, put }) {
      const response = yield call(querySafeFacilitiesEdit, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafeFacEdit',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 安全设施删除
    *fetchSafeFacDelete({ payload, success, error }, { call, put }) {
      const response = yield call(querySafeFacilitiesDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSafeFacDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveSafeFacList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        safeFacData: data,
      };
    },

    saveSafeFacAdd(state, { payload }) {
      return {
        ...state,
        safeFacDetail: payload,
      };
    },

    saveSafeFacEdit(state, { payload }) {
      return {
        ...state,
        safeFacDetail: {
          ...state.safeFacDetail,
          data: payload,
        },
      };
    },

    clearSafeFacDetail(state) {
      return {
        ...state,
        safeFacDetail: { data: {} },
      };
    },

    saveSafeFacDel(state, { payload: id }) {
      return {
        ...state,
        safeFacData: {
          ...state.safeFacData,
          list: state.safeFacData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
