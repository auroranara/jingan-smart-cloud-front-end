import {
  getCompanyList,
  getVehicleList,
  deleteVehicle,
} from '@/services/licensePlateRecognitionSystem';

export default {
  namespace: 'licensePlateRecognitionSystem',

  state: {
    companyList: {},
    vehicleList: {},
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
    /* 获取车辆列表 */
    *getVehicleList({ payload, callback }, { call, put }) {
      const response = yield call(getVehicleList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveVehicleList',
          payload: data,
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 刷新企业列表 */
    *reloadVehicleList(
      {
        payload: { total, pageNum, pageSize, ...payload },
        callback,
      },
      { call, put }
    ) {
      const response = yield call(getVehicleList, {
        pageNum: 1,
        pageSize: pageNum * pageSize,
        ...payload,
      });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            vehicleList: {
              ...data,
              pagination: {
                ...data.pagination,
                pageNum,
                pageSize,
              },
            },
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除车辆
    *deleteVehicle({ payload, callback }, { call, put }) {
      // const response = yield call(deleteVehicle, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
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
    saveVehicleList: (
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
      vehicleList: {
        list: pageNum === 1 ? list : state.vehicleList.list.concat(list),
        pagination,
      },
    }),
  },
};
