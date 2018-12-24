/**
 * 试卷排查报表
 */
import {
  // 获取试卷列表
  getList,
  // 获取试卷详情
  getDetail,
  // 删除试卷
  deleteItem,
  // 获取规则树
  getRuleTree,
  // 新增试卷
  addPaper,
  // 编辑试卷
  editPaper,
  // 预览试卷
  getPreview,
  // 获取企业列表
  getCompanyList,
} from '@/services/examinationPaper.js'
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

/**
 * 获取规则树的key名
 */
const getTreeKey = (type) => {
  switch(+type) {
    case 1:
      return 'singleTree';
    case 2:
      return 'multipleTree';
    case 3:
      return 'judgeTree';
    default:
      return;
  }
}

export default {
  namespace: 'examinationPaper',

  state: {
    /* 试卷列表 */
    list: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0,
      },
    },
    /* 试卷详情 */
    detail: {
    },
    // 单选树
    singleTree: [],
    // 多选树
    multipleTree: [],
    // 判断题树
    judgeTree: [],
    // 预览试卷
    preview: {},
    // 企业列表
    companyList: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    /**
     * 获取试卷列表
     */
    *fetchList({ payload: { realPageNum, realPageSize, ...payload }, callback }, { call, put }) {
      const response = yield call(getList, payload);
      if (response.code === 200) {
        let value = response.data;
        // 如果realPageNum和realPageSize存在的话，则重置pagination
        if (realPageNum && realPageSize) {
          value = { ...value, pagination: { ...value.pagination, pageNum: realPageNum, pageSize: realPageSize } };
        }
        yield put({
          type: 'save',
          payload: {
            key: 'list',
            value,
          },
        });
        if (callback) {
          callback(value);
        }
      }
      else {
        error();
      }
    },
    /**
     * 追加试卷列表
     */
    *appendList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      if (response.code === 200) {
        yield put({
          type: 'append',
          payload: response.data,
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
     * 获取试卷详情
     */
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
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
     * 删除试卷
     */
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteItem, payload);
      if (response.code === 200) {
        yield put({
          type: 'remove',
          payload,
        });
        if (callback) {
          callback(true);
        }
      }
      else if (callback) {
        callback(false);
      }
    },
    /**
     * 获取规则树
     */
    *fetchRuleTree({ payload, callback }, { call, put }) {
      const response = yield call(getRuleTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: getTreeKey(payload.questionType),
            value: response.data.list,
          },
        });
        if (callback) {
          callback(response.data.list);
        }
      }
      else {
        error();
      }
    },
    /**
     * 新增试卷
     */
    *insertPaper({ payload, callback }, { call }) {
      const response = yield call(addPaper, payload);
      if (response.code === 200) {
        if (callback) {
          callback(response.data);
        }
      }
      else if (callback) {
        callback();
      }
    },
    /**
     * 编辑试卷
     */
    *updatePaper({ payload, callback }, { call }) {
      const response = yield call(editPaper, payload);
      if (response.code === 200) {
        if (callback) {
          callback(response.data);
        }
      }
      else if (callback) {
        callback();
      }
    },
    /**
     * 预览试卷
     */
    *fetchPreview({ payload, callback }, { call, put }) {
      const response = yield call(getPreview, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'preview',
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
     * 获取企业列表
     */
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'companyList',
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
    /**
     * 追加数组
     */
    append(state, { payload: { list, pagination } }) {
      return {
        ...state,
        list: {
          list: state.list.list.concat(list),
          pagination,
        },
      };
    },
    /**
     * 删除
     */
    remove(state, { payload: { id: key } }) {
      return {
        ...state,
        list: {
          ...state.list,
          list: state.list.list.filter(({ id }) => id !== key),
        },
      };
    },
  },
}
