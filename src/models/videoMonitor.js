import {
  addVideoDevice,
  updateVideoDevice,
  queryVideoCompaniesList,
  queryVideoList,
  queryVideoDetail,
  queryModelList,
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
  },
};
