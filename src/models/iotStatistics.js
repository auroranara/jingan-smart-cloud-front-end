import { getCompanyList, getEquipmentTypeDetail } from '@/services/iotStatistics';

export default {
  namespace: 'iotStatistics',

  state: {
    companyList: {},
    equipmentTypeDetail: {},
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
