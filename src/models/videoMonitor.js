import {
  addVideoDevice,
  updateVideoDevice,
  queryVideoCompaniesList,
  queryVideoList,
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
      vedioCount: 0,
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
    videoData: {
      list: [],
    },
  },

  effects: {
    // 视频企业列表
    *fetchCompanyList({ payload }, { call, put }) {
      const response = yield call(queryVideoCompaniesList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryVideoCompaniesList',
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

  // 视频设备列表
  *fetchEquipmentList({ payload }, { call, put }) {
    console.log('11', 11);

    const response = yield call(queryVideoList, payload);
    if (response.code === 200) {
      yield put({
        type: 'queryVideoList',
        payload: response.data,
      });
    }
  },

  reducers: {
    // 视频企业列表
    queryVideoCompaniesList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
        vedioCount,
      } = payload;
      return {
        ...state,
        list: [...state.list, ...list],
        vedioCount,
        data: payload,
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
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        videoData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
  },
};
