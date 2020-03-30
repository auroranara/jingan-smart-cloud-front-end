import {
  getList,
  getMonitorTypeList,
  getMajorHazardList,
  getMonitorObjectTypeList,
  getMonitorObjectList,
} from '@/services/alarmMessage';

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
  namespace: 'alarmMessage',

  state: {
    list: {},
    monitorTypeList: [],
    majorHazardList: [],
    monitorObjectTypeList: [],
    monitorObjectList: [],
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, { bindMonitorEquipmentStatus: 1, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测类型列表
    *getMonitorTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorTypeList = transformMonitorTypeList(data.list);
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
    // 获取重大危险源列表
    *getMajorHazardList({ payload, callback }, { call, put }) {
      const response = yield call(getMajorHazardList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const majorHazardList = data.list;
        yield put({
          type: 'save',
          payload: {
            majorHazardList,
          },
        });
        callback && callback(true, majorHazardList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测对象类型列表
    *getMonitorObjectTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorObjectTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorObjectTypeList = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorObjectTypeList,
          },
        });
        callback && callback(true, monitorObjectTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测对象列表
    *getMonitorObjectList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorObjectList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorObjectList = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorObjectList,
          },
        });
        callback && callback(true, monitorObjectList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
