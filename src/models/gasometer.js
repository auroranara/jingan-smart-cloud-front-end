import {
  getStorageMediumList,
  getList,
  getDetail,
  add,
  edit,
  remove,
  getMonitorDeviceList,
  setMonitorDeviceBindStatus,
} from '@/services/gasometer';

export default {
  namespace: 'gasometer',

  state: {
    list: {},
    detail: {},
    storageMediumList: {},
    monitorDeviceList: {},
  },

  effects: {
    // 获取存储介质列表
    *getStorageMediumList({ payload, callback }, { call, put }) {
      const response = yield call(getStorageMediumList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const storageMediumList = data;
        yield put({
          type: 'save',
          payload: {
            storageMediumList,
          },
        });
        callback && callback(true, storageMediumList);
      } else {
        callback && callback(false, msg);
      }
    },
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
    // 获取详情
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const { scenePhotoList } = data;
        const detail = {
          ...data,
          scenePhoto: scenePhotoList && scenePhotoList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1-index, status: 'done' })),
        };
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 新增
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取监测设备列表
    *getMonitorDeviceList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorDeviceList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorDeviceList = data;
        yield put({
          type: 'save',
          payload: {
            monitorDeviceList,
          },
        });
        callback && callback(true, monitorDeviceList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 设置监测设备绑定状态
    *setMonitorDeviceBindStatus({ payload, callback }, { call }) {
      const response = yield call(setMonitorDeviceBindStatus, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
