import { queryTags } from '../services/api';
import { fetchCountAndExponent, fetchAlarmInfo } from '../services/monitor'

export default {
  namespace: 'monitor',

  state: {
    tags: [],
    countAndExponent: {},
    realTimeAlarm: [],
    historyAlarm: {},
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },
    // 获取监测指数和设备数量等信息
    *fetchCountAndExponent({ payload }, { call, put }) {
      const response = yield call(fetchCountAndExponent, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCountAndExponent',
          payload: response.data,
        })
      }
    },
    // 获取实时报警
    *fetchRealTimeAlarm({ payload }, { call, put }) {
      const response = yield call(fetchAlarmInfo, payload)
      if (response && response.error && response.error.code === 200) {
        yield put({
          type: 'saveRealTimeAlarm',
          payload: response.result,
        })
      }
    },
    // 获取历史记录
    *fetchHistoryAlarm({ payload }, { call, put }) {
      const response = yield call(fetchAlarmInfo, payload)

    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    saveCountAndExponent(state, { payload }) {
      return {
        ...state,
        countAndExponent: payload || {},
      }
    },
    saveRealTimeAlarm(state, { payload }) {
      return {
        ...state,
        realTimeAlarm: payload || [],
      }
    },
    /* saveHistoryAlarm(state,{payload}){
      return{
        ...state,
        historyAlarm:payload,
      }
    }, */
  },
};
