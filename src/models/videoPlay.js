import { getAllCamera, getStartToPlay } from '../services/bigPlatform/videoPlay';

export default {
  namespace: 'videoPlay',

  state: {
    // allCamera: [],
    startToPlay: '',
  },

  effects: {
    // *fetchAllCamera({ payload }, { call, put }) {
    //   const response = yield call(getAllCamera, payload);
    //   const { list } = response;
    //   yield put({ type: 'saveAllCamera', payload: list });
    // },
    *fetchStartToPlay({ payload, success }, { call, put }) {
      const response = yield call(getStartToPlay, payload);
      // if (payload.key_id === 'zhutongdao') {
      //   response = { src: 'http://anbao.wxjy.com.cn/hls/xsfx_jiefanglu.m3u8' };
      // } else if (payload.key_id === 'erdaomenchukou') {
      //   response = { src: 'http://218.90.184.178:23389/hls/dangkou/test.m3u8' };
      // }
      if (response && response.code === 200) {
        yield put({ type: 'startToPlay', payload: { src: response.data.url } });
        if (success) success(response);
      }
    },
  },

  reducers: {
    // saveAllCamera(state, action) {
    //   return { ...state, allCamera: action.payload };
    // },
    // startToPlay(state, action) {
    //   return { ...state, startToPlay: action.payload };
    // },
  },
}
