import {
  queryStorehouseList,
  addStorehouse,
  updateStorehouse,
  deleteStorehouse,
  queryCountCompanyNum,
  queryRegionList,
  queryDangerSourceList,
  fetchStorageSubstanceList,
} from '@/services/baseInfo/storehouse';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'storehouse',
  state: {
    list: [],
    pagination: defaultPagination,
    detail: {},
    countCompanyNum: 0,
    regionModal: { list: [], pagination: defaultPagination },
    dangerSourceModal: { list: [], pagination: defaultPagination },
    sensorCount: 0, // 传感器数量
    chemical: { // 装卸危险化学品种类
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {
    // 查询库房列表
    *fetchStorehouseList ({ payload, callback }, { call, put }) {
      const response = yield call(queryStorehouseList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建库房
    *addStorehouse ({ payload, success, error }, { call }) {
      const response = yield call(addStorehouse, payload);
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
    // 修改库房
    *editStorehouse ({ payload, success, error }, { call }) {
      const response = yield call(updateStorehouse, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 删除库房
    *deleteStorehouse ({ payload, success, error }, { call, put }) {
      const response = yield call(deleteStorehouse, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 查询单位数量
    *fetchCountCompanyNum ({ payload, callback }, { call, put }) {
      const response = yield call(queryCountCompanyNum, payload);
      if (response.code === 200) {
        yield put({
          type: 'countCompanyNum',
          payload: response.data,
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 查询库房列表
    *fetchRegionModel ({ payload, callback }, { call, put }) {
      const response = yield call(queryRegionList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRegionModel',
          payload: response.data,
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 重大危险源模态框
    *fetchDangerSourceModel ({ payload, callback }, { call, put }) {
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
    // 获取装卸危险化学品种类（存储物质列表）
    *fetchChemicalList ({ payload, callback }, { call, put }) {
      const res = yield call(fetchStorageSubstanceList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveChemical',
          payload: res.data,
        })
        if (callback) callback(res.data);
      }
    },
  },
  reducers: {
    saveList (state, { payload }) {
      const { list, pagination: { pageNum, pageSize, total } = {} } = payload;
      return {
        ...state,
        list,
        pagination: {
          pageSize,
          pageNum,
          total,
        },
      };
    },
    countCompanyNum (state, { payload }) {
      return {
        ...state,
        countCompanyNum: payload.companyNum || 0,
        sensorCount: payload.sensorNum || 0,
      };
    },
    // 库区弹出框
    saveRegionModel (state, { payload }) {
      return {
        ...state,
        regionModal: payload,
      };
    },
    saveDangerSourceModel (state, { payload }) {
      return {
        ...state,
        dangerSourceModal: payload,
      };
    },
    saveChemical (state, { payload }) {
      const { list, pagination: { pageNum, pageSize, total } = {} } = payload;
      return {
        ...state,
        chemical: {
          list,
          pagination: {
            pageSize,
            pageNum,
            total,
          },
        },
      };
    },
  },
};
