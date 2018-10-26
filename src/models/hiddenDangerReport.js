/**
 * 隐患排查报表
 */
import {
  // 获取隐患列表
  getHiddenDangerList,
  // 获取隐患详情
  getHiddenDangerDetail,
} from '@/services/hiddenDangerReport.js'
import router from 'umi/router';
import urls from '@/utils/urls';

/* 获取500地址 */
const {
  exception: { 500: exceptionUrl },
} = urls;

/**
 * 跳转到500页面
 */
const error = () => { router.push(exceptionUrl); };

export default {
  namespace: 'hiddenDangerReport',

  state: {
    /* 隐患列表 */
    list: {},
    /* 隐患详情 */
    detail: {},
  },

  effects: {
    /**
     * 获取隐患列表
     */
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'list',
            value: response.data,
          },
        });
        if (callback) {
          callback(response.data);
        }
      }
      else {
        error();
      }
    },
    /**
     * 获取隐患详情
     */
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'detail',
            value: response.data,
          },
        });
        if (callback) {
          callback(response.data);
        }
      }
      else {
        error();
      }
    },
  },

  reducers: {
    /**
     * 保存字段
     **/
    save(state, { payload: { key, value } }) {
      return {
        ...state,
        [key]: value,
      };
    },
  },
}
