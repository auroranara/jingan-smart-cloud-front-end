import {
  getList,
  getDetail,
  getBindingList,
  getTypeList,
  getProtocolList,
  getNetworkingList,
  getBrandList,
  getModelList,
  getOperatorList,
  getBuildingList,
  getFloorList,
  getPictureList,
  add,
  edit,
  remove,
} from '@/services/gateway';

export default {
  namespace: 'gateway',

  state: {
    list: {},
    bindingList: {},
    typeList: [],
    protocolList: [],
    networkingList: [],
    brandList: [],
    modelList: [],
    operatorList: [],
    buildingList: [],
    floorList: [],
    detail: {},
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            list: data,
          },
        });
        callback && callback(data);
      }
    },
    *fetchBindingList({ payload, callback }, { call, put }) {
      const response = yield call(getBindingList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            bindingList: data,
          },
        });
        callback && callback(data);
      }
    },
    *fetchTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getTypeList, { ...payload, type: 2 });
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            typeList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchProtocolList({ payload, callback }, { call, put }) {
      const response = yield call(getProtocolList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            protocolList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchNetworkingList({ payload, callback }, { call, put }) {
      const response = yield call(getNetworkingList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            networkingList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchBrandList({ payload, callback }, { call, put }) {
      const response = yield call(getBrandList, { ...payload, type: 2 });
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            brandList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchModelList({ payload, callback }, { call, put }) {
      const response = yield call(getModelList, { ...payload, type: 2 });
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            modelList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchOperatorList({ payload, callback }, { call, put }) {
      const response = yield call(getOperatorList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            operatorList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchBuildingList({ payload, callback }, { call, put }) {
      const response = yield call(getBuildingList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            buildingList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchFloorList({ payload, callback }, { call, put }) {
      const response = yield call(getFloorList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            floorList: data.list,
          },
        });
        callback && callback(data.list);
      }
    },
    *fetchPictureList({ payload, callback }, { call, put }) {
      const response = yield call(getPictureList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        callback && callback(data.list);
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const { installPhotoList, pointFixInfoList, buildingId, floorId } = data;
        const detail = {
          ...data,
          installPhotoList: installPhotoList && installPhotoList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1-index, status: 'done' })),
          marker: pointFixInfoList && pointFixInfoList.map(({ fixImgId, imgType, xnum, ynum }) => ({ key: Math.random(), id: fixImgId, ichnographyType: `${imgType}`, xNum: xnum, yNum: ynum, ...(+imgType === 2 && { buildingId, floorId }) })),
        };
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
