import {
  addVideoDevice,
  updateVideoDevice,
  queryVideoCompaniesList,
  queryVideoList,
  queryVideoDetail,
  queryModelList,
  fetchVideoBeacons,
  fetchVideoBeaconsAvailable,
  bindBeacon,
  unBindBeacon,
  fetchSystemList,
  fetchBindedMonitorDevice,
  fetchUnBindedMonitorDevice,
  bindedMonitorDevice,
  unbindedMonitorDevice,
  fetchBindedFireDevice,
  fetchUnBindedFireDevice,
  bindedFirerDevice,
  unbindedFirerDevice,
  getOptionalList,
  getModelDescList,
  getClassTypeList,
  fetchFireFilterList,
  fetchDictList,
} from '../services/videoMonitor';

export default {
  namespace: 'videoMonitor',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
      videoCount: 0,
    },
    list: [],
    pageNum: 1,
    isLast: false,
    detail: {
      data: {
        companyName: undefined,
        deviceId: undefined,
        keyId: undefined,
        name: undefined,
        status: undefined,
        rtspAddress: undefined,
        photoAddress: undefined,
        isInspection: undefined,
        xNum: undefined,
        yNum: undefined,
        xFire: undefined,
        yFire: undefined,
      },
    },
    categories: [],
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    videoData: {
      list: [],
    },
    // 关联设备
    associateDevice: {
      // 已绑定列表
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      // 未绑定列表
      availableList: [],
      availablePagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    systemList: [],
    // 品牌列表
    optionalList: [],
    // 产品型号列表
    modelDescList: [],
    // 监测类型列表
    classTypeList: [],
    // 消控主机
    deviceCodes: [],
    // 设施部件类型
    dictDataList: [],
    facilitySystemList: [],
  },

  effects: {
    // 视频企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoCompaniesList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveVideoCompaniesList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },
    // 查询视频企业列表
    *appendCompanyList({ payload }, { call, put }) {
      const response = yield call(queryVideoCompaniesList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveVideoLoadMoreList',
          payload: response.data,
        });
      }
    },
    // 新增视频设备信息
    *fetchVideoDevice({ payload, success, error }, { call, put }) {
      const response = yield call(addVideoDevice, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addVideoDevice', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改视频设备信息
    *updateVideoDevice({ payload, success, error, callback }, { call, put }) {
      const response = yield call(updateVideoDevice, payload);
      if (response.code === 200) {
        yield put({ type: 'updateDetail', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
      callback && callback(response.code);
    },

    // 视频设备列表
    *fetchEquipmentList({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (response.code === 200) {
        if (callback) callback([...response.data.list]);
        yield put({
          type: 'queryVideoList',
          payload: response.data,
        });
      }
    },

    //  查看视频设备信息
    *fetchVideoDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoDetail, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 企业列表弹出框
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(queryModelList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveModelList',
          payload: response.data,
        });
      }
    },
    // 获取视频绑定的信标（人员定位）
    *fetchVideoBeacons({ payload }, { call, put }) {
      const response = yield call(fetchVideoBeacons, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveVideoDevice',
          payload: response.data,
        })
      }
    },
    // 获取未绑定视频的信标（人员定位）
    *fetchVideoBeaconsAvailable({ payload }, { call, put }) {
      const response = yield call(fetchVideoBeaconsAvailable, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAvailableVideoDevice',
          payload: response.data,
        })
      }
    },
    // 绑定信标（人员定位）
    *bindBeacon({ payload, success, error }, { call, put }) {
      const response = yield call(bindBeacon, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 取消关联信标（人员定位）
    *unBindBeacon({ payload, success, error }, { call, put }) {
      const response = yield call(unBindBeacon, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取系统列表（全部）
    *fetchSystemList({ payload }, { call, put }) {
      const response = yield call(fetchSystemList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveSystemList',
          payload: response.data.list,
        })
      }
    },
    // 获取已绑定设备（动态监测）
    * fetchBindedMonitorDevice({ payload }, { call, put }) {
      const response = yield call(fetchBindedMonitorDevice, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveVideoDevice',
          payload: response.data,
        })
      }
    },
    // 获取未绑定设备（动态监测）
    *fetchUnBindedMonitorDevice({ payload }, { call, put }) {
      const response = yield call(fetchUnBindedMonitorDevice, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAvailableVideoDevice',
          payload: response.data,
        })
      }
    },
    // 视频绑定设备（动态监测）
    *bindedMonitorDevice({ payload, success, error }, { call }) {
      const response = yield call(bindedMonitorDevice, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 视频解绑设备（动态监测）
    *unbindedMonitorDevice({ payload, success, error }, { call }) {
      const response = yield call(unbindedMonitorDevice, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 当前摄像头绑定的报警点位(火灾报警系统)
    *fetchBindedFireDevice({ payload }, { call, put }) {
      const response = yield call(fetchBindedFireDevice, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveVideoDevice',
          payload: response.data,
        })
      }
    },
    // 当前摄像头可绑定的报警点位(火灾报警系统)
    *fetchUnBindedFireDevice({ payload }, { call, put }) {
      const response = yield call(fetchUnBindedFireDevice, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAvailableVideoDevice',
          payload: response.data,
        })
      }
    },
    // 绑定摄像头（批量）(火灾报警系统)
    *bindedFirerDevice({ payload, success, error }, { call, put }) {
      const response = yield call(bindedFirerDevice, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 解除绑定关系(火灾报警系统)
    *unbindedFirerDevice({ payload, success, error }, { call, put }) {
      const response = yield call(unbindedFirerDevice, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取品牌列表
    *getOptionalList({ payload }, { call, put }) {
      const response = yield call(getOptionalList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'optionalList', value: response.data.list || [] },
        })
      }
    },
    // 获取产品型号列表
    *getModelDescList({ payload }, { call, put }) {
      const response = yield call(getModelDescList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'modelDescList', value: response.data.list || [] },
        })
      }
    },
    // 获取监测类型列表
    *getClassTypeList({ payload }, { call, put }) {
      const response = yield call(getClassTypeList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'classTypeList', value: response.data.list || [] },
        })
      }
    },
    // 获取消控主机和设施部件列表
    *fetchFireFilterList({ payload }, { call, put }) {
      const response = yield call(fetchFireFilterList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveFireFilterList',
          payload: response.data,
        })
      }
    },
    // 获取设施系统类型 传入key决定保存的参数
    *fetchDictList({ payload }, { call, put }) {
      const response = yield call(fetchDictList, payload)
      if (response) {
        yield put({
          type: 'saveState',
          payload: { key: payload.key, value: response.result || [] },
        })
      }
    },
  },

  reducers: {
    // 视频企业列表
    saveVideoCompaniesList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 查询视频企业列表
    saveVideoLoadMoreList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 新增视频设备信息
    addVideoDevice(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 修改视频设备信息
    updateDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 视频设备列表
    queryVideoList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        videoData: payload,
      };
    },

    // 查看视频设备信息
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
      };
    },

    // 企业弹出框
    saveModelList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        modal: payload,
      };
    },
    saveVideoDevice(state, { payload: {
      list = [],
      pagination = { pageNum: 1, pageSize: 10, total: 0 },
    } = {} }) {
      return {
        ...state,
        associateDevice: {
          ...state.associateDevice,
          list,
          pagination,
        },
      }
    },
    saveAvailableVideoDevice(state, { payload: {
      list = [],
      pagination = { pageNum: 1, pageSize: 10, total: 0 },
    } = {} }) {
      return {
        ...state,
        associateDevice: {
          ...state.associateDevice,
          availableList: list,
          availablePagination: pagination,
        },
      }
    },
    saveSystemList(state, { payload = [] }) {
      return {
        ...state,
        systemList: payload,
      }
    },
    saveState(state, { payload: { key, value } }) {
      state[key] = value
      return {
        ...state,
      }
    },
    saveFireFilterList(state, { payload: { deviceCodes = [], dictDataList = [] } }) {
      return {
        ...state,
        deviceCodes,
        dictDataList,
      }
    },
  },
};
