import {
  querySpecialEquipList,
  addSpecialEquip,
  updateSpecialEquip,
  deleteSpecialEquip,
  queryReportList,
  queryReportAdd,
} from '@/services/baseInfo/specialEquipment';

import { getBrandList, getModelList } from '@/services/gateway';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'specialEquipment',
  state: {
    a: 0,
    b: 0,
    c: 0,
    list: [],
    pagination: defaultPagination,
    detail: {},
    brandList: [],
    modelList: [],
    reportData: {
      list: [],
      pagination: {},
    },
    markers: [],
  },
  effects: {
    // 查询特种设备列表
    *fetchSpecialEquipList({ payload, callback }, { call, put }) {
      const response = yield call(querySpecialEquipList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: { ...response.data },
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 查询特种设备列表
    *fetchMarkers({ payload, callback }, { call, put }) {
      const response = yield call(querySpecialEquipList, payload);
      if (response.code === 200 && response.data && response.data.list) {
        yield put({
          type: 'save',
          payload: { markers: response.data.list },
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建特种设备
    *addSpecialEquip({ payload, success, error }, { call }) {
      const response = yield call(addSpecialEquip, payload);
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
    // 修改特种设备
    *editSpecialEquip({ payload, success, error }, { call }) {
      const response = yield call(updateSpecialEquip, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 删除特种设备
    *deleteSpecialEquip({ payload, success, error }, { call, put }) {
      const response = yield call(deleteSpecialEquip, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    *fetchBrandList({ payload, callback }, { call, put }) {
      const response = yield call(getBrandList, { ...payload });
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            brandList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchModelList({ payload, callback }, { call, put }) {
      const response = yield call(getModelList, { ...payload });
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            modelList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    // 报告列表
    *fetchReportList({ payload, callback }, { call, put }) {
      const response = yield call(queryReportList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveReportList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 报告新增
    *fetchReportAdd({ payload, callback }, { call, put }) {
      const response = yield call(queryReportAdd, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    saveList(state, { payload }) {
      const { list, pagination: { pageNum, pageSize, total } = {}, a } = payload;
      return {
        ...state,
        list,
        pagination: {
          pageSize,
          pageNum,
          total,
        },
        a,
      };
    },
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveReportList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        reportData: data,
      };
    },
  },
};
