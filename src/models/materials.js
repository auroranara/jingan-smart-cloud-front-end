import {
  queryMaterialsList,
  addMaterials,
  updateMaterials,
  deleteMaterials,
  queryDangerSourceList,
  queryMsdsList,
} from '@/services/baseInfo/materials';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'materials',
  state: {
    list: [],
    pagination: defaultPagination,
    detail: {},
    companyNum: 0,
    dangerSourceModal: { list: [], pagination: defaultPagination },
    msdsModal: { list: [], pagination: defaultPagination },
  },
  effects: {
    // 查询物料列表
    *fetchMaterialsList({ payload, callback }, { call, put }) {
      const response = yield call(queryMaterialsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: { ...response.data, companyNum: response.msg },
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建物料
    *addMaterials({ payload, success, error }, { call }) {
      const response = yield call(addMaterials, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改物料
    *editMaterials({ payload, success, error }, { call }) {
      const response = yield call(updateMaterials, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 删除物料
    *deleteMaterials({ payload, success, error }, { call, put }) {
      const response = yield call(deleteMaterials, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 重大危险源模态框
    *fetchDangerSourceModel({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerSourceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDangerSourceModel',
          payload: response.data,
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 重大危险源模态框
    *fetchMsdsModel({ payload, callback }, { call, put }) {
      const response = yield call(queryMsdsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMsdsModel',
          payload: response.data,
        });
        if (callback) {
          callback(response);
        }
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      const { list, pagination: { pageNum, pageSize, total } = {}, companyNum } = payload;
      return {
        ...state,
        list,
        pagination: {
          pageSize,
          pageNum,
          total,
        },
        companyNum,
      };
    },
    // 库区弹出框
    saveDangerSourceModel(state, { payload }) {
      return {
        ...state,
        dangerSourceModal: payload,
      };
    },
    saveMsdsModel(state, { payload }) {
      return {
        ...state,
        msdsModal: payload,
      };
    },
  },
};
