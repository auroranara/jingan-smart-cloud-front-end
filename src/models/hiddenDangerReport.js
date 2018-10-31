/**
 * 隐患排查报表
 */
import {
  // 获取隐患列表
  getHiddenDangerList,
  // 获取隐患详情
  getHiddenDangerDetail,
  // 获取所属网格列表
  getGridList,
  // 获取单位名称列表
  getUnitNameList,
  // 获取隐患来源列表
  getSourceList,
  // 获取隐患状态列表
  getStatusList,
  // 获取业务分类列表
  getBusinessTypeList,
  // 获取隐患等级列表
  getLevelList,
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
    list: {
      list: [
        {
          id: 0,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 1,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 2,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 3,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 4,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 5,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 6,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 7,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 8,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 9,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
        {
          id: 10,
          unitName: 1,
          source: 1,
          pointName: 1,
          businessType: 1,
          checkContent: 1,
          level: 1,
          status: 1,
          checkPerson: 1,
          createTime: 1,
          planRectifyTime: 1,
          description: 1,
          image: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
          rectifyMeasure: 1,
          rectifyMoney: 1,
          rectifyImage: [{id:1,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:2,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'},{id:3,src:'http://data.jingan-china.cn/hello/gsafe/hidden_danger/180820-153838-GOLB.png'}],
        },
      ],
      pagination: {

      },
    },
    /* 隐患详情 */
    detail: {},
    /* 所属网格列表 */
    gridList: [],
    /* 单位名称列表 */
    unitNameList: [],
    /* 隐患来源列表 */
    sourceList: [],
    /* 隐患状态列表 */
    statusList: [],
    /* 业务分类列表 */
    businessTypeList: [],
    /* 隐患等级列表 */
    levelList: [],
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
    /**
     * 获取所属网格列表
     */
    *fetchGridList({ payload, callback }, { call, put }) {
      const response = yield call(getGridList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'gridList',
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
     * 获取单位名称列表
     */
    *fetchUnitNameList({ payload, callback }, { call, put }) {
      const response = yield call(getUnitNameList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'unitNameList',
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
     * 获取隐患来源列表
     */
    *fetchSourceList({ payload, callback }, { call, put }) {
      const response = yield call(getSourceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'sourceList',
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
     * 获取隐患状态列表
     */
    *fetchStatusList({ payload, callback }, { call, put }) {
      const response = yield call(getStatusList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'statusList',
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
     * 获取业务分类列表
     */
    *fetchBusinessTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getBusinessTypeList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'businessTypeList',
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
     * 获取隐患等级列表
     */
    *fetchLevelList({ payload, callback }, { call, put }) {
      const response = yield call(getLevelList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'levelList',
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
