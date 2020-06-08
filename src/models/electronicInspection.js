import {
  fetchProductionArea,
  addProductionArea,
  editProductionArea,
  deleteProductionArea,
  fetchPersonList,
} from '@/services/electronicInspection';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'electronicInspection',

  state: {
    // 生产区域
    productionArea: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    productionAreaDetail: {},
    // 负责人
    person: defaultData,
  },

  effects: {
    // 获取生产区域列表
    *fetchProductionArea ({ payload, callback }, { call, put }) {
      const res = yield call(fetchProductionArea, payload);
      const data = res && res.code === 200 && res.data ? res.data : defaultData;
      yield put({
        type: 'saveProductionArea',
        payload: data,
      });
      callback && callback(data);
    },
    // 新增生产区域
    *addProductionArea ({ payload, callback }, { call }) {
      const res = yield call(addProductionArea, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 编辑生产区域
    *editProductionArea ({ payload, callback }, { call }) {
      const res = yield call(editProductionArea, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 删除生产区域
    *deleteProductionArea ({ payload, callback }, { call }) {
      const res = yield call(deleteProductionArea, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取生产区域详情
    *fetchProductionAreaDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchProductionArea, { pageNum: 1, pageSize: 0, ...payload });
      const detail = res && res.data && res.data.list && res.data.list.length ? res.data.list[0] : {};
      yield put({
        type: 'saveDetail',
        payload: detail,
      })
      callback && callback(res && res.code === 200, detail);
    },
    // 获取负责人列表
    *fetchPersonList ({ payload }, { call, put }) {
      const res = yield call(fetchPersonList, payload);
      yield put({
        type: 'savePerson',
        payload: res && res.code === 200 && res.data ? res.data : defaultData,
      })
    },
  },

  reducers: {
    saveProductionArea (state, action) {
      return {
        ...state,
        productionArea: action.payload || defaultData,
      }
    },
    saveDetail (state, action) {
      return {
        ...state,
        productionAreaDetail: action.payload,
      }
    },
    savePerson (state, action) {
      return {
        ...state,
        person: action.payload,
      }
    },
  },
}
