import { getZone, zoning } from '../services/zoning';

export default {
  namespace: 'zoning',

  state: {
    zone: {},
  },

  effects: {
    *fetchZone({ payload, callback }, { call, put }) {
      // const { code, data } = yield call(getZone, payload);
      const { code, data } = {
        code: 200,
        data: {
          name: '一厂区一号楼二楼',
          url: 'http://data.jingan-china.cn/v2/login/nanxiao/1_blur.png',
          image: {
            id: '1',
            url: 'http://data.jingan-china.cn/v2/login/nx/1.png',
            latlngs: [
              {lat: 0.2, lng: 0.2},
              {lat: 0.5, lng: 0.2},
              {lat: 0.5, lng: 0.6},
              {lat: 0.2, lng: 0.6},
            ],
          },
        },
      };
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            zone: data,
          },
        });
        if (callback) {
          callback(data);
        }
      }
      else if (callback) {
        callback();
      }
    },
    *zoning({ payload, callback }, { call, put }) {
      // const { code, data } = yield call(zoning, payload);
      const { code } = { code: 200 };
      if (callback) {
        callback(code === 200);
      }
    },
  },
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
