import {
  fetchList,
  addQualification,
  editQualification,
  deleteQualification,
} from '@/services/contractorQualification';

const defaultPagination = { total: 0, pageSize: 10, pageNum: 1 };

export default {
  namespace: 'contractorQualification',

  state: {
    data: {
      a: 0,
      list: [],
      pagination: defaultPagination,
    },
  },

  effects: {
    // 获取承包商人员资质列表
    *fetchList ({ payload, callback }, { call, put }) {
      const res = yield call(fetchList, payload);
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveData',
          payload: res.data,
        });
        callback && callback(res.data);
      }
    },
    // 新增承包商人员资质
    *addQualification ({ payload, callback }, { call }) {
      const res = yield call(addQualification, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 编辑承包商人员资质
    *editQualification ({ payload, callback }, { call }) {
      const res = yield call(editQualification, payload);
      callback && callback(res && res.code === 200, res);
    },
    // 删除承包商人员资质
    *deleteQualification ({ payload, callback }, { call }) {
      const res = yield call(deleteQualification, payload);
      callback && callback(res && res.code === 200, res);
    },
  },

  reducers: {
    saveData (state, action) {
      return {
        ...state,
        data: action.payload || { list: [], a: 0, pagination: defaultPagination },
      }
    },
  },
}
