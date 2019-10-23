import {
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/gasometer';
import { message } from 'antd';
const generateList = ({ pageNum, pageSize }) => {
  const start = (pageNum - 1) * pageSize;
  return Array.from({ length: pageSize }).map((_, index) => ({
    id: `${start + index + 1}`,
    companyName: '利民化工股份有限公司',
    name: `气柜${start + index + 1}`,
    code: `${start + index + 1}`,
    storageMedium: '未知',
    casNumber: `${start + index + 1}`,
    isMajorHazard: '0',
    araa: '这是区域',
    location: '这是位置',
  }));
};

export default {
  namespace: 'gasometer',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: generateList(payload),
          pagination: {
            total: 100,
            ...payload,
          },
        },
      };
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(list);
      } else {
        message.error('获取列表失败，请稍后重试！');
      }
    },
    // 获取详情
    *getDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDetail, payload);
      const response = {
        code: 200,
        data: {
          id: 1,
        },
      };
      const { code, data } = response || {};
      if (code === 200 && data) {
        const detail = data;
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
      } else {
        message.error('获取详情失败，请稍后重试！');
      }
    },
    // 新增
    *add({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      // const response = yield call(edit, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call }) {
      // const response = yield call(remove, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
