import {
  fetchKeyPartList,
  addKeyPart,
  editKeyPart,
  deleteKeyPart,
} from '@/services/keyPart';

const defaultData = {
  list: [],
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
}

export default {
  namespace: 'keyPart',

  state: {
    // 关键装置重点部位
    list: [],
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    companyNum: 0,
    detail: {},
  },

  effects: {
    // 关键装置重点部位-获取列表
    *fetchKeyPartList ({ payload }, { call, put }) {
      const res = yield call(fetchKeyPartList, payload);
      yield put({
        type: 'saveKeyPart',
        payload: res && res.code === 200 && res.data ? { ...res.data, companyNum: res.msg } : { ...defaultData, companyNum: 0 },
      })
    },
    // 关键装置重点部位-新增
    *addKeyPart ({ payload, callback }, { call }) {
      const res = yield call(addKeyPart, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 关键装置重点部位-编辑
    *editKeyPart ({ payload, callback }, { call }) {
      const res = yield call(editKeyPart, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 关键装置重点部位-删除
    *deleteKeyPart ({ payload, callback }, { call }) {
      const res = yield call(deleteKeyPart, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 关键装置重点部位-获取详情
    *fetchKeyPartDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchKeyPartList, { ...payload, pageNum: 1, pageSize: 10 });
      const detail = res && res.data && res.data.list && res.data.list.length ? res.data.list[0] : {};
      yield put({
        type: 'saveDetail',
        payload: detail,
      })
      callback && callback(res && res.code === 200, detail);
    },
  },

  reducers: {
    saveKeyPart (state, action) {
      const { list, pagination, companyNum = 0 } = action.payload;
      return {
        ...state,
        list,
        pagination,
        companyNum,
      }
    },
    saveDetail (state, action) {
      return {
        ...state,
        detail: action.payload,
      }
    },
  },
}
