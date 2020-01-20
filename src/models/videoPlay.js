import { getAllCamera, getStartToPlay } from '../services/bigPlatform/videoPlay';

export default {
  namespace: 'videoPlay',

  state: {
    videoId: '',
    startToPlay: '',
  },

  effects: {
    // 'http://anbao.wxjy.com.cn/hls/xsfx_jiefanglu.m3u8'
    // http://218.90.184.178:23389/hls/dangkou/test.m3u8
    *fetchStartToPlay({ payload, success, error }, { call, put, select }) {
      console.log('11111');
      console.log('payload', payload);

      yield put({
        type: 'saveVideoId',
        payload: { videoId: payload.key_id },
      });
      if (!payload.key_id) return;
      const response = yield call(getStartToPlay, payload);
      if (response && response.code === 200 && response.data.url !== '该设备ID不存在') {
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
