import {
  getCompanyList,
  getEquipmentTypeDetail,
  getCompanyMonitorTypeList,
} from '@/services/iotStatistics';
import { message } from 'antd';

export default {
  namespace: 'iotStatistics',

  state: {
    companyList: {},
    equipmentTypeDetail: {},
    // 企业已接入的监测类型列表
    companyMonitorTypeList: [],
  },

  effects: {
    /* 获取企业列表 */
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveCompanyList',
          payload: data,
        });
        callback && callback(true, data);
      } else {
        message.error('获取列表失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
    *getEquipmentTypeDetail({ payload, callback }, { call, put }) {
      const response = yield call(getEquipmentTypeDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const equipmentTypeDetail = data;
        yield put({
          type: 'save',
          payload: {
            equipmentTypeDetail,
          },
        });
        callback && callback(true, equipmentTypeDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取企业的监测类型列表
    *getCompanyMonitorTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMonitorTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyMonitorTypeList = data.list;
        yield put({
          type: 'save',
          payload: { companyMonitorTypeList },
        });
        callback && callback(true, companyMonitorTypeList);
      } else {
        message.error('获取监测类型失败，请稍后重试！');
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveCompanyList: (
      state,
      {
        payload: {
          list,
          pagination,
          pagination: { pageNum },
        },
      }
    ) => ({
      ...state,
      companyList: {
        list: pageNum === 1 ? list : state.companyList.list.concat(list),
        pagination,
      },
    }),
  },
};
