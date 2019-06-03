import {
  getCompanyList,
  getCountTypeDict,
  getCountList,
  getDepartmentDict,
  getHiddenDangerTypeDict,
  getCheckTypeDict,
  getGridDict,
  exportReport,
} from '@/services/hiddenDangerCountReport';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';

function error(msg='请求接口失败，请稍后重试！') {
  message.error(msg);
}
function formatDict(dict, mapper) {
  const { key='key', value='value', children='children' } = mapper;
  return dict.map(({ [key]: k, [value]: v, [children]: c }) => {
    return {
      key: String(k),
      value: v,
      children: c ? formatDict(c, mapper) : [],
    };
  });
}

export default {
  namespace: 'hiddenDangerCountReport',

  state: {
    companyList: {}, // 单位列表
    countList: [], // 列表
    countTypeDict: [], // 统计类型
    departmentDict: [], // 所属部门
    hiddenDangerTypeDict: [], // 隐患类型
    checkTypeDict: [], // 检查类型
    gridDict: [], // 所属网格
    dateTypeDict: [
      {
        key: '1',
        value: '日',
      },
      {
        key: '2',
        value: '月',
      },
      {
        key: '3',
        value: '年',
      },
    ],
    hiddenDangerStatusDict: [
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
    ], // 隐患状态
  },

  effects: {
    *init({ payload, callback }, { call, put, all }) {
      const response = yield all([
        call(getCountTypeDict, payload),
        call(getDepartmentDict, payload),
        call(getHiddenDangerTypeDict, payload),
        call(getCheckTypeDict, payload),
      ]);
      if (response.every((item) => item && item.code === 200)) {
        yield put({
          type: 'save',
          payload: {
            countTypeDict: response[0].data && response[0].data.list ? formatDict(response[0].data.list, { key: 'value', value: 'desc' }) : [],
            departmentDict: response[1].data && response[1].data.list ? formatDict(response[1].data.list, { key: 'departmentId', value: 'departmentName' }) : [],
            hiddenDangerTypeDict: response[2].data && response[2].data.list ? formatDict(response[2].data.list, { key: 'value', value: 'label' }) : [],
            checkTypeDict: response[3].data && response[3].data.list ? formatDict(response[3].data.list, { key: 'value', value: 'label' }) : [],
          },
        });
      }
      else {
        error();
      }
      callback && callback(response);
    },
    *fetchGridDict({ payload, callback }, { call, put }) {
      const response = yield call(getGridDict, payload);
      const { code=500, data, msg='获取所属网格失败，请稍后重试！' } = response || {};
      if (code === 200) {
        const gridDict = data && data.list ? data.list : [];
        yield put({
          type: 'save',
          payload: {
            gridDict,
          },
        });
      }
      else {
        error(msg);
      }
      callback && callback(response);
    },
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code=500, data, msg='获取单位列表失败，请稍后重试！' } = response || {};
      if (code === 200) {
        const { list, pagination } = data || {};
        yield put({
          type: 'saveCompanyList',
          payload: {
            list: list || [],
            pagination: {
              total: 0,
              pageNum: 1,
              pageSize: 18,
              ...pagination,
            },
          },
        });
      }
      else {
        error(msg);
      }
      callback && callback(response);
    },
    *fetchCountList({ payload, callback }, { call, put }) {
      const response = yield call(getCountList, payload);
      const { code=500, data, msg='获取隐患统计报表失败，请稍后重试！' } = response || {};
      if (code === 200) {
        const countList = data && data.list ? data.list : [];
        yield put({
          type: 'save',
          payload: {
            countList,
          },
        });
      }
      else {
        error(msg);
      }
      callback && callback(response);
    },
    *exportReport({ payload }, { call }) {
      const blob = yield call(exportReport, payload);
      fileDownload(blob, `隐患统计报表_${moment().format('YYYYMMDD')}.xlsx`);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCompanyList(state, { payload: { list, pagination } }) {
      return {
        ...state,
        companyList: {
          list: pagination.pageNum === 1 ? list : [...state.companyList.list, ...list],
          pagination,
        },
      };
    },
  },
};
