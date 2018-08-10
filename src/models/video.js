// import { queryVideoList, bindVideo, queryFolderTree, queryVideoDetail, queryVideoUrl } from '../services/video';
import { queryVideoList, queryFolderTree, queryVideoDetail, queryVideoUrl } from '../services/video';
// import { getIdMap } from '../pages/DeviceManagement/HikVideoTree/FolderTree';

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
    // idMap: {},
    videoUrl: null,
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *clearTree(_, { put }) {
      yield put({
        type: 'clear',
      });
    },
    // *bind({ payload, callback }, { call }) {
    //   const response = yield call(bindVideo, payload);
    //   if (response.code === 200) {
    //     if (callback) callback();
    //   }
    // },
    *fetchFolderTree({ callback }, { call, put }) {
      const response = yield call(queryFolderTree);
      const { data } = response;
      const { list } = data;
      if (response.code === 200) {
        yield put({
          type: 'saveFolderTree',
          payload: data,
        });
        if (callback) callback(list);
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
      if (callback) {
        callback();
      }
    },
    *fetchVideoUrl({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.data,
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
      const { list: folderList } = action.payload;
      // const idMap = {};
      // getIdMap(folderList, idMap);

      return {
        ...state,
        folderList,
        // idMap,
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
