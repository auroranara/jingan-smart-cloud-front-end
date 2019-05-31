import {
  getCountTypeDict,
  getCountList,
  getDepartmentDict,
  getHiddenDangerTypeDict,
  getCheckTypeDict,
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
    countList: [], // 列表
    countTypeDict: [], // 统计类型
    departmentDict: [], // 所属部门
    hiddenDangerTypeDict: [], // 隐患类型
    checkTypeDict: [], // 检查类型
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
      const reponse = yield all([
        call(getCountTypeDict, payload),
        call(getDepartmentDict, payload),
        call(getHiddenDangerTypeDict, payload),
        call(getCheckTypeDict, payload),
      ]);
      if (reponse.every((item) => item && item.code === 200)) {
        yield put({
          type: 'save',
          payload: {
            countTypeDict: reponse[0].data && reponse[0].data.list ? formatDict(reponse[0].data.list, { key: 'value', value: 'desc' }) : [],
            departmentDict: reponse[1].data && reponse[1].data.list ? formatDict(reponse[1].data.list, { key: 'departmentId', value: 'departmentName' }) : [],
            hiddenDangerTypeDict: reponse[2].data && reponse[2].data.list ? formatDict(reponse[2].data.list, { key: 'value', value: 'label' }) : [],
            checkTypeDict: reponse[3].data && reponse[3].data.list ? formatDict(reponse[3].data.list, { key: 'value', value: 'label' }) : [],
          },
        });
        callback && callback(reponse);
      }
      else {
        error();
      }
    },
    *fetchCountList({ payload, callback }, { call, put }) {
      const reponse = yield call(getCountList, payload);
      const { code=200, data, msg='获取隐患统计报表失败，请稍后重试！' } = reponse || {};
      if (code === 200) {
        const countList = data && data.list ? data.list : [];
        yield put({
          type: 'save',
          payload: {
            countList,
          },
        });
        callback && callback(countList);
      }
      else {
        error(msg);
      }
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
  },
};
