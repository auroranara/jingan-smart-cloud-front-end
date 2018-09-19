import {
  queryCompanies,
  // queryAlarmNums,
  queryAlarmData,
  queryAlarmDetail,
  queryCompanyHistories,
  queryOptions,
  queryHistoryDetail,
} from '../services/fireAlarm';

export default {
  namespace: 'fireAlarm',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    list: [],
    // alarmNums: [0, 0, 0, 0, 0, 0],
    tableLists: [],
    pagination: {},
    alarmDetail: {},
    historyData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    deviceCodes: [], // 主机编号
    dictDataList: [], // 设施部件类型
    // 历史纪录详情
    historyDetail: {
      name: '',
      time: '',
      code: '',
      failureCode: '',
      type: '',
      position: '',
      alarmStatus: '',
      safetyName: '',
      safetyPhone: '',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      const {
        code,
        data: {
          pagination: { total },
        },
      } = response;

      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下拉是否还加载数据
      if (callback) callback(total);

      if (code !== 200) return;

      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },

    *fetchAlarmData({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmData, payload);
      const { code, data } = response;
      if (callback) callback(code);
      if (code !== 200) return;
      // const pagin = {};
      // ['pageNum', 'pageSize', 'total'].forEach(p => { pagin[p] = Number.parseInt(pagination[p], 10) });
      yield put({ type: 'saveAlarmData', payload: data });
    },
    *fetchAlarmDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmDetail, payload);
      const { code, data } = response;
      if (callback) callback(code);
      if (code !== 200) return;
      yield put({ type: 'saveAlarmDetail', payload: data });
    },
    *fetchCompanyHistories({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyHistories, payload);
      const { code, pagination, list } = response;
      if (callback) callback();
      if (code !== 200) return;
      yield put({ type: 'saveCompanyHistories', payload: { pagination, list } });
    },
    *fetchOptions({ payload }, { call, put }) {
      const response = yield call(queryOptions, payload);
      const { code, data } = response;
      if (code !== 200) return;
      yield put({ type: 'saveOptions', payload: data });
    },
    *fetchHistoryDetail({ payload }, { call, put }) {
      const response = yield call(queryHistoryDetail, payload);
      const { code, data } = response;
      if (code !== 200) return;
      yield put({ type: 'saveHistoryDetail', payload: data });
    },
  },

  reducers: {
    saveList(state, action) {
      const { pageNum, list } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);

      return { ...state, data: action.payload, list: nextList };
    },
    saveAlarmData(state, action) {
      return { ...state, tableLists: action.payload };
    },
    saveAlarmDetail(state, action) {
      return { ...state, alarmDetail: action.payload };
    },
    saveCompanyHistories(state, action) {
      return { ...state, historyData: action.payload };
    },
    saveOptions(state, action) {
      return {
        ...state,
        deviceCodes: action.payload.deviceCodes,
        dictDataList: action.payload.dictDataList,
      };
    },
    saveHistoryDetail(state, action) {
      return { ...state, historyDetail: action.payload };
    },
  },
};
