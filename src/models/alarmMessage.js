import {
  getList,
  getMonitorTypeList,
} from '@/services/alarmMessage';

const transformMonitorTypeList = (list) => {
  return list ? list.reduce((result, { id, name: title, child: children }) => {
    return [
      ...result,
      {
        key: id,
        value: id,
        title,
        children: children && children.length > 0 ? transformMonitorTypeList(children) : undefined,
      },
    ];
  }, []) : [];
}

export default {
  namespace: 'alarmMessage',

  state: {
    list: {},
    monitorTypeList: [],
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
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
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
