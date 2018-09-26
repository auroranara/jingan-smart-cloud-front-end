import { addVideoDevice, updateVideoDevice } from '../services/videoMonitor';

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
    },
    list: [],
    detail: {},
    categories: [],
    pageNum: 1,
    isLast: false,
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    // 新增视频设备信息
    *fetchVideoDevice({ payload, success, error }, { call }) {
      const response = yield call(addVideoDevice, payload);
      if (response.code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  // 修改视频设备信息
  *updateVideoDevice({ payload, success, error }, { call, put }) {
    const response = yield call(updateVideoDevice, payload);
    if (response.code === 200) {
      yield put({
        type: 'updateDetail',
        payload: response.data,
      });
      if (success) {
        success();
      }
    } else if (error) {
      error(response.msg);
    }
  },

  reducers: {
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
  },
};
