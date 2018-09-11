import { getAllCamera, getStartToPlay, getGasCount, getGasList } from '../services/bigPlatform/monitor';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'monitor',

  state: {
    allCamera: [],
    gasCount: {},
    gasList: [],
    // startToPlay: '',
  },

  effects: {
    *fetchAllCamera({ payload }, { call, put }) {
      const response = yield call(getAllCamera, payload);
      if (response && response.list)
        yield put({ type: 'saveAllCamera', payload: response.list });
    },
    *fetchStartToPlay({ payload, success }, { call, put }) {
      const response = yield call(getStartToPlay, payload);
      if (response && response.code === 200) {
        // yield put({ type: 'startToPlay', payload: { src: response.data.url } });
        if (success) success(response);
      }
    },
    *fetchGasCount({ payload }, { call, put }) {
      let response = yield call(getGasCount, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200)
        yield put({ type: 'saveGasCount', payload: data });
    },
    *fetchGasList({ payload }, { call, put }) {
      let response = yield call(getGasList, payload);
      response = response || EMPTY_OBJECT;
      const { result = EMPTY_OBJECT } = response;
      yield put({ type: 'saveGasList', payload: result });
    },
  },

  reducers: {
    saveAllCamera(state, action) {
      return { ...state, allCamera: action.payload };
    },
    // startToPlay(state, action) {
    //   return { ...state, startToPlay: action.payload };
    // },
    saveGasCount(state, action) {
      return { ...state, gasCount: action.payload };
    },
    saveGasList(state, action) {
      return { ...state, gasList: action.payload };
    },
  },
};
