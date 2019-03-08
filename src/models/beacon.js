import {
  getDetail,
  getImages,
  getSystems,
  insertBeacon,
  updateBeacon,
} from '../services/beacon.js';
import { message } from 'antd';

// 格式化地图
function formatImages(list) {
  return list.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}

export default {
  namespace: 'beacon',

  state: {
    // 信标详情
    detail: {},
    // 图片
    images: [],
    // 图片map
    imagesMap: {},
    // 系统
    systems: [],
  },

  effects: {
    *init({ payload: { companyId, id }, callback }, { call, put, all }) {
      // 如果id存在，则为编辑，否则为新增
      let result;
      if (id) {
        result = yield all([
          call(getImages, { companyId }),
          call(getSystems, { companyId, pageSize: 0, pageNum: 1 }),
          call(getDetail, { id }),
        ]);
      }
      else {
        result = yield all([
          call(getImages, { companyId }),
          call(getSystems, { companyId, pageSize: 0, pageNum: 1 }),
        ]);
      }
      if (result.every(item => item && item.code === 200)) {
        const [{ data: { list: images } }, { data: { list: systems } }, { data: detail={} }={}] = result;
        yield put({
          type: 'save',
          payload: { detail, images, systems, imagesMap: formatImages(images) },
        });
        if (callback) {
          callback(true);
        }
      }
      else if (callback) {
        callback(false);
      }
    },
    // 获取信标详情
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { detail: response.data },
        });
        if (callback) {
          callback(response);
        }
      }
      else if (callback) {
        callback(response);
      }
    },
    // 获取图片列表
    *fetchImages({ payload, callback }, { call, put }) {
      const response = yield call(getImages, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { images: response.data.list, imagesMap: formatImages(response.data.list) },
        });
        if (callback) {
          callback(response);
        }
      }
      else if (callback) {
        callback(response);
      }
    },
    // 获取系统列表
    *fetchSystems({ payload, callback }, { call, put }) {
      const response = yield call(getSystems, { pageSize: 0, pageNum: 1, ...payload });
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { images: response.data.list },
        });
        if (callback) {
          callback(response);
        }
      }
      else if (callback) {
        callback(response);
      }
    },
    // 新增信标
    *addBeacon({ payload, callback }, { call, put }) {
      const response = yield call(insertBeacon, payload);
      if (response && response.code === 200) {
        message.success('新增成功！', 1.5, () => {
          callback && callback(true);
        });
      }
      else {
        message.error('新增失败，请联系负责人！', 1.5, () => {
          callback && callback(false);
        });
      }
    },
    // 编辑信标
    *editBeacon({ payload, callback }, { call, put }) {
      const response = yield call(updateBeacon, payload);
      if (response && response.code === 200) {
        message.success('编辑成功！', 1.5, () => {
          callback && callback(true);
        });
      }
      else {
        message.error('编辑失败，请联系负责人！', 1.5, () => {
          callback && callback(false);
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
