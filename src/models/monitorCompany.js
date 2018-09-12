import { getGsmsHstData, getPieces } from '../services/bigPlatform/monitor';

export default {
  namespace: 'monitorCompany',

  state: {
    gsmsHstData: {},
    electricityPieces: [],
  },

  effects: {
    // 获取传感器历史
    *fetchGsmsHstData({ payload, success, error }, { call, put }) {
      const response = yield call(getGsmsHstData, payload);
      if (response.code === 200) {
        yield put({
          type: 'gsmsHstData',
          payload: response.data.result,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 获取上下线的区块
    *fetchPieces({ payload, success, error }, { call, put }) {
      const response = yield call(getPieces, payload);
      if (response.code === 200) {
        yield put({
          type: 'electricityPieces',
          payload: response.data.list,
          code: payload.code,
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
    gsmsHstData(state, action) {
      return {
        ...state,
        gsmsHstData: action.payload,
      };
    },
    electricityPieces(state, action) {
      const obj = {};
      obj[action.code] = action.payload;
      return {
        ...state,
        electricityPieces: {
          ...state.electricityPieces,
          ...obj,
        },
      };
    },
  },
};
