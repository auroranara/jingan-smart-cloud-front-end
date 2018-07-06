import {
  queryCompanies,
  // queryAlarmNums,
  queryAlarmData,
  queryAlarmDetail,
} from '../services/fireAlarm';

export default {
  namespace: 'fireAlarm',

  state: {
    list: [],
    // alarmNums: [0, 0, 0, 0, 0, 0],
    tableLists: [],
    pagination: {},
    alarmDetail: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      const {
        code,
        data: {
          list,
          pagination: { pageNum, total },
        },
      } = response;

      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下拉是否还加载数据
      if (callback) callback(total);

      if (code !== 200) return;

      yield put({
        type: 'saveList',
        payload: { pageNum, list },
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
  },

  reducers: {
    saveList(state, action) {
      const { pageNum, list } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);

      return { ...state, list: nextList };
    },
    saveAlarmData(state, action) {
      return { ...state, tableLists: action.payload };
    },
    saveAlarmDetail(state, action) {
      return { ...state, alarmDetail: action.payload };
    },
  },
};
