// import { queryVideoList, queryVideoTree, bindVideo, queryFolderTree, queryVideoUrl } from '../services/video';
import { queryVideoList, bindVideo, queryFolderTree, queryVideoDetail, queryVideoUrl } from '../services/video';

export default {
  namespace: 'video',

  state: {
    data: {
      list: [],
      tree: [],
      pagination: {},
    },
    detail: {},
    folderList: [],
    videoUrl: null,
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: response.result,
        });
        if (callback) callback();
      }
    },
    *clearTree(_, { put }) {
      yield put({
        type: 'clear',
      });
    },
    *bind({ payload, callback }, { call }) {
      const response = yield call(bindVideo, payload);
      if (response.status === 200) {
        if (callback) callback();
      }
    },
    *fetchFolderTree({ callback }, { call, put }) {
      const response = yield call(queryFolderTree);
      if (response.status === 200) {
        yield put({
          type: 'saveFolderTree',
          payload: response.result,
        });
        if (callback) callback();
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoDetail, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.result,
        });
      }
      if (callback) {
        callback();
      }
    },
    *fetchVideoUrl({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.result,
        });
      }
      if (callback) {
        callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    addChildren(state) {
      return {
        ...state,
      };
    },
    clear(state) {
      return {
        ...state,
        data: {
          list: [],
        },
      };
    },
    saveFolderTree(state, action) {
      return {
        ...state,
        folderList: action.payload.list,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveVideoUrl(state, { payload }) {
      return {
        ...state,
        videoUrl: payload,
      };
    },
  },
};
