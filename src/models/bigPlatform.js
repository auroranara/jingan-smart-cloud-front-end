import { getProjectName, getLocationCenter, getItemList, getCountDangerLocation } from '../services/bigPlatform/bigPlatform.js';

export default {
  namespace: 'bigPlatform',

  state: {
    itemTotal: 0,
    countDangerLocation: {
      total: 0,
      red: 0,
      orange: 0,
      yellow: 0,
      blue: 0,
    },
    currentCount: 0,
    todayCount: 0,
    faultVideoCount: 0,
    userList: [],
    videoList: [],
    videoUrl: null,
  },

  effects: {
    *fetchItemList({ payload, success, error }, { call, put }) {
      const response = yield call(getItemList, payload);
      if (response.status === 200) {
        yield put({
          type: 'itemList',
          payload: response.total,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    *fetchCountDangerLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getCountDangerLocation, payload);
      if (response.status === 200) {
        yield put({
          type: 'countDangerLocation',
          payload: response.countDangerLocation,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
  },

  reducers: {
    itemList(state, { payload }) {
      return {
        ...state,
        itemTotal: payload,
      };
    },
    countDangerLocation(state, { payload }) {
      return {
        ...state,
        countDangerLocation: payload,
      };
    },
    saveVideos(state, { payload }) {
      return {
        ...state,
        videoList: payload,
      };
    },
    saveVideoUrl(state, { payload }) {
      return {
        ...state,
        videoUrl: payload,
      };
    },
    deleteVideoUrl(state) {
      return {
        ...state,
        videoUrl: null,
      };
    },
  },
};
