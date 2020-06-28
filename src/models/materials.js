import {
  queryMaterialsList,
  addMaterials,
  updateMaterials,
  deleteMaterials,
  queryDangerSourceList,
  queryMsdsList,
  fetchInfoByCas,
  queryMonitorList,
} from '@/services/baseInfo/materials';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'materials',
  state: {
    // 物料类型选项
    materialTypeOptions: [
      { value: '1', label: '生产原料' },
      { value: '2', label: '中间产品' },
      { value: '3', label: '最终产品' },
    ],
    list: [],
    pagination: defaultPagination,
    detail: {},
    companyNum: 0,
    dangerSourceModal: { list: [], pagination: defaultPagination },
    msdsModal: { list: [], pagination: defaultPagination },
    monitorModal: { list: [], pagination: defaultPagination },
    // 物料列表（另开的，与之前的区分）
    materialDetail: {},
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
    // 获取物料列表（为了不影响之前的，所以另开一个）
    *getMaterialDetail({ payload }, { call, put }) {
      const response = yield call(queryMaterialsList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list && data.list[0]) {
        const materialDetail = data.list[0];
        yield put({
          type: 'save',
          payload: {
            materialDetail,
          },
        });
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
    // 根据CAS号获取信息
    *fetchInfoByCas({ payload, callback }, { call }) {
      const res = yield call(fetchInfoByCas, payload);
      if (res && res.code === 200) {
        callback && callback(res.data.list.length ? '1' : '0');
      }
    },
    *fetchMonitorList({ payload, callback }, { call, put }) {
      const response = yield call(queryMonitorList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMonitorModal',
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
    saveMonitorModal(state, { payload }) {
      return {
        ...state,
        monitorModal: payload,
      };
    },
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};
