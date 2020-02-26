import {
  getCompanyList,
  getAreaList,
  getMonitorTypeList,
  getMonitorEquipmentList,
  setMonitorEquipmentBindStatus,
  getPersonList,
} from '@/services/common';

const transformMonitorTypeList = list => {
  return list
    ? list.reduce((result, { id, name: title, child: children }) => {
        return [
          ...result,
          {
            key: id,
            value: id,
            title,
            children:
              children && children.length > 0 ? transformMonitorTypeList(children) : undefined,
          },
        ];
      }, [])
    : [];
};

export default {
  namespace: 'common',

  state: {
    companyList: {
      list: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    },
    areaList: [],
    monitorTypeList: [],
    monitorEquipmentList: {},
    personList: {},
  },

  effects: {
    /* 获取列表 */
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const companyList = data || {};
        yield put({
          type: 'save',
          payload: {
            companyList,
          },
        });
        if (callback) {
          callback(companyList);
        }
      }
    },
    // 获取区域列表
    *getAreaList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const areaList = data.list;
        yield put({
          type: 'save',
          payload: {
            areaList,
          },
        });
        callback && callback(true, areaList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测类型列表
    *getMonitorTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorTypeList = data.list.map(({ id, name }) => ({ key: id, value: name }));
        yield put({
          type: 'save',
          payload: {
            monitorTypeList,
          },
        });
        callback && callback(true, monitorTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测设备列表
    *getMonitorEquipmentList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorEquipmentList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorEquipmentList = data;
        yield put({
          type: 'save',
          payload: {
            monitorEquipmentList,
          },
        });
        callback && callback(true, monitorEquipmentList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 设置监测设备绑定状态
    *setMonitorEquipmentBindStatus({ payload, callback }, { call }) {
      const response = yield call(setMonitorEquipmentBindStatus, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取人员列表
    *getPersonList({ payload, callback }, { call, put }) {
      const response = yield call(getPersonList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const personList = data;
        yield put({
          type: 'save',
          payload: {
            personList,
          },
        });
        callback && callback(true, personList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
