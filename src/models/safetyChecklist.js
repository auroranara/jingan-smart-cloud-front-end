
import {
  fetchSafeChecklist,
  addSafeChecklist,
  editSafeChecklist,
  deleteSafeChecklist,
  judgeRiskPoint,
  synchronize,
  copySafeChecklist,
  fetchRecordList,
  addRecord,
  editRecord,
  deleteRecord,
  fetchRecordDetail,
} from '@/services/safetyChecklist';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'safetyChecklist',

  state: {
    data: defaultData,
    record: defaultData,
  },
  effects: {
    // 获取安全检查表-SCL分析列表
    *fetchSafeChecklist ({ payload }, { call, put }) {
      const res = yield call(fetchSafeChecklist, payload);
      yield put({
        type: 'saveChecklist',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 判断风险点是否存在
    *judgeRiskPoint ({ payload, callback }, { call }) {
      const res = yield call(judgeRiskPoint, payload);
      callback && callback(res && res.data ? res.data : null);
    },
    // 同步信息
    *synchronize ({ payload, callback }, { call }) {
      const res = yield call(synchronize, payload);
      callback && callback(res && res.code === 200);
    },
    // 新增安全检查表
    *addSafeChecklist ({ payload, callback }, { call }) {
      const res = yield call(addSafeChecklist, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 编辑安全检查表
    *editSafeChecklist ({ payload, callback }, { call }) {
      const res = yield call(editSafeChecklist, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 删除安全检查表
    *deleteSafeChecklist ({ payload, callback }, { call }) {
      const res = yield call(deleteSafeChecklist, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 复制安全检查表
    *copySafeChecklist ({ payload, callback }, { call }) {
      const res = yield call(copySafeChecklist, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 获取检查项目列表
    *fetchRecordList ({ payload }, { call, put }) {
      const res = yield call(fetchRecordList, payload);
      yield put({
        type: 'saveRecord',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
    // 新增检查项目
    *addRecord ({ payload, callback }, { call }) {
      const res = yield call(addRecord, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 编辑检查项目
    *editRecord ({ payload, callback }, { call }) {
      const res = yield call(editRecord, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 删除检查项目
    *deleteRecord ({ payload, callback }, { call }) {
      const res = yield call(deleteRecord, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 获取检查项目详情
    *fetchRecordDetail ({ payload, callback }, { call }) {
      const res = yield call(fetchRecordDetail, payload);
      callback && callback(res && res.data ? res.data : {});
    },
  },
  reducers: {
    saveChecklist (state, action) {
      return {
        ...state,
        data: action.payload || defaultData,
      }
    },
    saveRecord (state, action) {
      return {
        ...state,
        record: action.payload || defaultData,
      }
    },
  },
}
