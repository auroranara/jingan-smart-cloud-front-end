
import {
  fetchCheckList,
  addCheckList,
  editCheckList,
  deleteCheckList,
  reviewCheckList,
  publishCheckList,
  fetchOperatingProcedureList,
  addOperatingProcedure,
  editOperatingProcedure,
  deleteOperatingProcedure,
  publishOperatingProcedure,
  reviewOperatingProcedure,
} from '@/services/safetyProductionRegulation';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'safetyProductionRegulation',

  state: {
    // 操作规程
    operatingProcedures: defaultData,
    // 操作规程详情
    operatingProceduresDetail: {},
    // 操作规程历史
    operatingProceduresHistory: defaultData,
    // 检查表维护
    checkList: defaultData,
    // 检查表维护历史
    checkListHistory: defaultData,
    // 检查表维护详情
    checkListDetail: {},
  },

  effects: {
    // 检查表维护-获取列表
    *fetchCheckList ({ payload }, { call, put }) {
      const res = yield call(fetchCheckList, { ...payload, historyType: 1 });
      yield put({
        type: 'saveCheckList',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 检查表维护-新增
    *addCheckList ({ payload, callback }, { call }) {
      const res = yield call(addCheckList, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 检查表维护-编辑
    *editCheckList ({ payload, callback }, { call }) {
      const res = yield call(editCheckList, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 检查表维护-审核
    *reviewCheckList ({ payload, callback }, { call }) {
      const res = yield call(reviewCheckList, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 检查表维护-发布
    *publishCheckList ({ payload, callback }, { call }) {
      const res = yield call(publishCheckList, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 检查表维护-获取详情
    *fetchCheckListDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchCheckList, { ...payload, pageNum: 1, pageSize: 10 });
      const detail = res && res.data && res.data.list && res.data.list.length ? res.data.list[0] : {};
      yield put({
        type: 'saveCheckListDetail',
        payload: detail,
      })
      callback && callback(res && res.code === 200, detail);
    },
    // 检查表维护-获取历史
    *fetchCheckListHistory ({ payload }, { call, put }) {
      const res = yield call(fetchCheckList, { ...payload, historyType: 0 });
      yield put({
        type: 'saveCheckListHistory',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 操作规程-获取列表
    *fetchOperatingProcedureList ({ payload }, { call, put }) {
      const res = yield call(fetchOperatingProcedureList, { ...payload, historyType: 1 });
      yield put({
        type: 'saveOperatingProcedures',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 操作规程-新增
    *addOperatingProcedure ({ payload, callback }, { call }) {
      const res = yield call(addOperatingProcedure, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 操作规程-编辑
    *editOperatingProcedure ({ payload, callback }, { call }) {
      const res = yield call(editOperatingProcedure, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 操作规程-审核
    *reviewOperatingProcedure ({ payload, callback }, { call }) {
      const res = yield call(reviewOperatingProcedure, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 操作规程-发布
    *publishOperatingProcedure ({ payload, callback }, { call }) {
      const res = yield call(publishOperatingProcedure, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 操作规程-获取详情
    *fetchOperatingProcedureDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchOperatingProcedureList, { ...payload, pageNum: 1, pageSize: 10 });
      const detail = res && res.data && res.data.list && res.data.list.length ? res.data.list[0] : {};
      yield put({
        type: 'saveOperatingProceduresDetail',
        payload: detail,
      })
      callback && callback(res && res.code === 200, detail);
    },
    // 操作规程-获取历史
    *fetchOperatingProceduresHistory ({ payload }, { call, put }) {
      const res = yield call(fetchOperatingProcedureList, { ...payload, historyType: 0 });
      yield put({
        type: 'saveOperatingProceduresHistory',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
  },

  reducers: {
    saveCheckList (state, action) {
      return {
        ...state,
        checkList: action.payload,
      }
    },
    saveCheckListHistory (state, action) {
      return {
        ...state,
        checkListHistory: action.payload,
      }
    },
    saveCheckListDetail (state, action) {
      return {
        ...state,
        checkListDetail: action.payload,
      }
    },
    saveOperatingProcedures (state, action) {
      return {
        ...state,
        operatingProcedures: action.payload,
      }
    },
    saveOperatingProceduresDetail (state, action) {
      return {
        ...state,
        operatingProceduresDetail: action.payload,
      }
    },
    saveOperatingProceduresHistory (state, action) {
      return {
        ...state,
        operatingProceduresHistory: action.payload,
      }
    },
  },
}
