import {
  queryCompanies,
  queryAlarmNums,
  queryAlarmTableData,
  queryAlarmDetail,
} from '../services/fireAlarm';

export default {
  namespace: 'fireAlarm',

  state: {
    list: [],
    alarmNums: [0, 0, 0, 0, 0, 0],
    tableList: [],
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
    *fetchAlarmNums({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmNums, payload);
      const { code, data: { alarmNums } } = response;
      if (callback) callback(code);
      if (code !== 200) return;
      yield put({ type: 'saveAlarmNums', payload: alarmNums });
    },
    *fetchAlarmTableData({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmTableData, payload);
      const { code, data: { tableList } } = response;
      if (callback) callback(code);
      if (code !== 200) return;
      // const pagin = {};
      // ['pageNum', 'pageSize', 'total'].forEach(p => { pagin[p] = Number.parseInt(pagination[p], 10) });
      yield put({ type: 'saveAlarmTableData', payload: { tableList } });
    },
    *fetchAlarmDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmDetail, payload);
      const { code, data: { alarmDetail } } = response;
      if (callback) callback(code);
      if (code !== 200) return;
      yield put({ type: 'saveAlarmDetail', payload: alarmDetail });
    },
  },

  reducers: {
    saveList(state, action) {
      const { pageNum, list } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);

      return { ...state, list: nextList };
    },
    saveAlarmNums(state, action) {
      return { ...state, alarmNums: action.payload };
    },
    saveAlarmTableData(state, action) {
      const { tableList, pagination } = action.payload;
      return { ...state, tableList, pagination };
    },
    saveAlarmDetail(state, action) {
      return { ...state, alarmDetail: action.payload };
    },
  },
};
