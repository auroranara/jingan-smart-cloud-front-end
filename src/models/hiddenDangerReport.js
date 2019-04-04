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
  // 导出
  exportData,
  // 获取文书列表
  getDocumentList,
  // 新添隐患字典数据
  getHiddenContent,
} from '@/services/hiddenDangerReport.js';
import fileDownload from 'js-file-download';
import moment from 'moment';
import router from 'umi/router';
import urls from '@/utils/urls';
/* 格式化网格树 */
const formatGrid = function(tree) {
  const list = [];
  for (let { grid_id, grid_name, children } of tree) {
    if (children && children.length > 0) {
      children = formatGrid(children);
    }
    list.push({
      key: grid_id,
      value: grid_id,
      title: grid_name,
      children,
    });
  }
  return list;
};
/* 完善步骤条数组 */
const formatTimeLine = function(timeLine) {
  const list = timeLine.map((item, index) => {
    let type = +item.type;
    if (type === 1) {
      type = '隐患创建';
    } else if (type === 2) {
      // 如果index大于1，意味着必然为重新整改
      if (index > 1) {
        type = '重新整改';
      } else {
        type = '隐患整改';
      }
    } else if (type === 3) {
      type = '隐患复查';
    } else if (type === 4) {
      type = '隐患关闭';
    }
    return {
      ...item,
      type,
      id: index,
    };
  });
  const lastIndex = timeLine.length - 1;
  const { type } = timeLine[lastIndex];
  switch (+type) {
    case 1:
      list.push({ type: '隐患整改', id: lastIndex + 1 }, { type: '隐患复查', id: lastIndex + 2 });
      break;
    case 2:
      list.push({ type: '隐患复查', id: lastIndex + 1 });
      break;
    case 3:
      list.push({ type: '重新整改', id: lastIndex + 1 }, { type: '隐患复查', id: lastIndex + 2 });
      break;
    default:
      break;
  }
  return list;
};

/* 获取500地址 */
const {
  exception: { 500: exceptionUrl },
} = urls;

/**
 * 跳转到500页面
 */
const error = () => {
  router.push(exceptionUrl);
};

export default {
  namespace: 'hiddenDangerReport',

  state: {
    /* 隐患列表 */
    list: {
      list: [],
      pagination: {},
    },
    /* 隐患详情 */
    detail: {
      hiddenDanger: {},
      hiddenDangerRecord: [],
      timeLine: [],
      current: 0,
    },
    /* 文书列表 */
    documentList: [],
    /* 所属网格列表 */
    gridList: [],
    /* 业务分类列表 */
    businessTypeList: [
      {
        key: '1',
        value: '安全生产',
      },
      {
        key: '2',
        value: '消防',
      },
      {
        key: '3',
        value: '环保',
      },
      {
        key: '4',
        value: '卫生',
      },
    ],
    /* 隐患来源列表 */
    sourceList: [
      {
        key: '1',
        value: '企业自查',
      },
      {
        key: '2',
        value: '政府监督',
      },
      {
        key: '3',
        value: '维保检查',
      },
    ],
    /* 隐患状态列表 */
    statusList: [
      {
        key: '2',
        value: '待整改',
      },
      {
        key: '3',
        value: '待复查',
      },
      {
        key: '4',
        value: '已关闭',
      },
      {
        key: '7',
        value: '已超期',
      },
    ],
    /* 隐患等级列表 */
    levelList: [
      {
        key: '一般隐患',
        value: '一般隐患',
      },
      {
        key: '三级隐患',
        value: '三级隐患',
      },
      {
        key: '二级隐患',
        value: '二级隐患',
      },
      {
        key: '一级隐患',
        value: '一级隐患',
      },
    ],
    /* 相关文书列表 */
    documentTypeList: [
      {
        key: '0',
        value: '现场检查意见书',
      },
      {
        key: '1',
        value: '整改指令书',
      },
      {
        key: '2',
        value: '复查意见书',
      },
    ],
    /* 新添隐患字段列表 */
    hiddenContentList: [],
  },

  effects: {
    /**
     * 获取隐患列表
     */
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
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
      } else {
        error();
      }
    },
    /**
     * 追加隐患列表
     */
    *appendList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      if (response.code === 200) {
        yield put({
          type: 'append',
          payload: response.data,
        });
        if (callback) {
          callback(response.data);
        }
      } else {
        error();
      }
    },
    /**
     * 获取隐患详情
     */
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerDetail, payload);
      const timeLine = formatTimeLine(response.data.timeLine);
      const value = {
        ...response.data,
        timeLine,
        current: response.data.timeLine.length - 1,
      };
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'detail',
            value,
          },
        });
        if (callback) {
          callback(value);
        }
      } else {
        error();
      }
    },
    /**
     * 获取所属网格列表
     */
    *fetchGridList({ payload, callback }, { call, put }) {
      const response = yield call(getGridList, payload);
      if (response.code === 200) {
        const list = formatGrid(response.data.list);
        yield put({
          type: 'save',
          payload: {
            key: 'gridList',
            value: list,
          },
        });
        if (callback) {
          callback(list);
        }
      } else {
        error();
      }
    },
    /**
     * 获取所属网格列表
     */
    *exportData({ payload, callback }, { call, put }) {
      const blob = yield call(exportData, payload);
      fileDownload(blob, `隐患排查报表_${moment().format('YYYYMMDD')}.xls`);
    },
    /**
     * 获取文书列表
     */
    *fetchDocumentList({ payload, callback }, { call, put }) {
      const response = yield call(getDocumentList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'documentList',
            value: response.data.list,
          },
        });
        if (callback) {
          callback(response.data.list);
        }
      } else {
        error();
      }
    },

    // 获取新添隐患字段
    *fetchHiddenContent({ payload }, { call, put }) {
      const response = yield call(getHiddenContent, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'queryHiddenContent',
          payload: response.data.list,
        });
      }
    },
  },

  reducers: {
    /**
     * 保存字段
     **/
    save(
      state,
      {
        payload: { key, value },
      }
    ) {
      return {
        ...state,
        [key]: value,
      };
    },
    /**
     * 追加数组
     */
    append(
      state,
      {
        payload: { list, pagination },
      }
    ) {
      return {
        ...state,
        list: {
          list: state.list.list.concat(list),
          pagination,
        },
      };
    },

    // 获取隐患新添字段
    queryHiddenContent(state, { payload: hiddenContentList }) {
      return {
        ...state,
        hiddenContentList,
      };
    },
  },
};
