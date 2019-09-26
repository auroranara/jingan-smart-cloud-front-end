import {
  queryAreaList,
  queryAreaAdd,
  queryAreaEdit,
  queryAreaDelete,
  queryCompanyNum,
  queryDangerSourceList,
  queryDangerSourceaAdd,
  queryDangerSourceEdit,
  queryDangerSourceDelete,
  queryMaterialInfoList,
} from '../services/company/reservoirRegion';

export default {
  namespace: 'reservoirRegion',

  state: {
    // 库区数据源
    areaData: {
      list: [],
      pagination: {},
    },
    areaDetail: {
      data: [],
    },
    envirTypeList: [
      { key: '1', value: '一类区' },
      { key: '2', value: '二类区' },
      { key: '3', value: '三类区' },
    ],
    areaCount: {},
    // 危险源数据源
    sourceData: {
      list: [],
      pagination: {},
    },
    sourceDetail: {
      data: [],
    },
    dangerTypeList: [
      { key: '1', value: '一级' },
      { key: '2', value: '二级' },
      { key: '3', value: '三级' },
      { key: '4', value: '四级' },
    ],
    productTypeList: [
      { key: '1', value: '生产' },
      { key: '2', value: '经营' },
      { key: '3', value: '使用' },
      { key: '4', value: '存储' },
    ],
    dangerChemicalsList: [
      { key: '1', value: '易燃' },
      { key: '2', value: '有毒' },
      { key: '3', value: '兼易燃有毒' },
    ],
    memoryPlaceList: [{ key: '1', value: '自有' }, { key: '2', value: '租赁' }],
    antiStaticList: [{ key: '1', value: '是' }, { key: '2', value: '否' }],
    materialData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 库区列表
    *fetchAreaList({ payload, callback }, { call, put }) {
      const response = yield call(queryAreaList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAreaList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 数量
    *fetchCount({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyNum, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCount',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增库区
    *fetchAreaAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveAreaAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改库区
    *fetchAreaEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除库区
    *fetchAreaDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 危险源列表
    *fetchSourceList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerSourceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSourceList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增危险源
    *fetchSourceAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveSourceAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改危险源
    *fetchSourceEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSourceEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除危险源
    *fetchSourceDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSourceDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 获取物料列表
    *fetchMaterialInfoList({ payload, callback }, { call, put }) {
      const response = yield call(queryMaterialInfoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMaterialInfoList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },
  },

  reducers: {
    // 库区列表
    saveAreaList(state, { payload }) {
      const {
        data,
        data: { list },
      } = payload;
      return {
        ...state,
        list,
        areaData: data,
      };
    },

    saveCount(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        areaCount: data,
      };
    },

    // 新增库区
    saveAreaAdd(state, { payload }) {
      return {
        ...state,
        areaDetail: payload,
      };
    },

    // 编辑库区
    saveAreaEdit(state, { payload }) {
      return {
        ...state,
        areaDetail: {
          ...state.areaDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        areaDetail: { data: {} },
      };
    },

    // 删除库区
    saveAreaDelete(state, { payload: id }) {
      return {
        ...state,
        areaData: {
          ...state.areaData,
          list: state.areaData.list.filter(item => item.id !== id),
        },
      };
    },

    // 危险源列表
    saveSourceList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msg,
        sourceData: data,
      };
    },

    // 新增危险源
    saveSourceAdd(state, { payload }) {
      return {
        ...state,
        sourceDetail: payload,
      };
    },

    // 编辑危险源
    saveSourceEdit(state, { payload }) {
      return {
        ...state,
        sourceDetail: {
          ...state.sourceDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearSourceDetail(state) {
      return {
        ...state,
        sourceDetail: { data: {} },
      };
    },

    // 删除危险源
    saveSourceDelete(state, { payload: id }) {
      return {
        ...state,
        sourceData: {
          ...state.sourceData,
          list: state.sourceData.list.filter(item => item.id !== id),
        },
      };
    },

    // 物料列表
    saveMaterialInfoList(state, { payload }) {
      const {
        data,
        data: { list },
      } = payload;
      return {
        ...state,
        list,
        materialData: data,
      };
    },
  },
};
