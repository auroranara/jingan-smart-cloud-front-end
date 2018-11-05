import { getAllCamera, getStartToPlay } from '../services/bigPlatform/videoPlay';

export default {
  namespace: 'videoPlay',

  state: {
    videoId: '',
    startToPlay: '',
  },

  effects: {
    // *fetchAllCamera({ payload }, { call, put }) {
    //   const response = yield call(getAllCamera, payload);
    //   const { list } = response;
    //   yield put({ type: 'saveAllCamera', payload: list });
    // },

    // 'http://anbao.wxjy.com.cn/hls/xsfx_jiefanglu.m3u8'
    // http://218.90.184.178:23389/hls/dangkou/test.m3u8
    *fetchStartToPlay({ payload, success, error }, { call, put, select }) {
      // let videoId = yield select(state => state.videoPlay.videoId);
      // console.log('开始的videoId', videoId);
      // console.log('payload.key_id', payload.key_id);
      // 只有当一开始没有视频或者请求的key与返回的key相同时候 才会播放
      // if (videoId && payload.key_id !== videoId) return;
      yield put({
        type: 'saveVideoId',
        payload: { videoId: payload.key_id },
      });
      const response = yield call(getStartToPlay, payload);
      if (response && response.code === 200) {
        let videoId = yield select(state => state.videoPlay.videoId);
        if (videoId && response.data.key_id !== videoId) return;
        yield put({
          type: 'saveVideo',
          payload: { src: response.data.url, videoId: response.data.key_id },
        });
        if (success) success(response);
      } else if (error) {
        error(response);
      }
    },

    *clearVideo({ payload, callback }, { put }) {
      yield put({
        type: 'saveVideo',
        payload: { src: '', videoId: '' },
      });

      if (callback) callback();
    },
  },
  reducers: {
    // saveAllCamera(state, action) {
    //   return { ...state, allCamera: action.payload };
    // },
    saveVideoId(
      state,
      {
        payload: { src, videoId },
      }
    ) {
      // console.log('saveVideo', action.payload.videoId);
      return { ...state, videoId: videoId };
    },
    saveVideo(
      state,
      {
        payload: { src, videoId },
      }
    ) {
      // console.log('saveVideo', action.payload.videoId);
      return { ...state, startToPlay: src, videoId: videoId };
    },
  },
};
