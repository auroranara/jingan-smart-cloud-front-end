import {
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/gasometer';
import { message } from 'antd';
const generateDetail = ({ id }) => ({
  id,
  name: `专项检查${id}`,
  content: id==='1' ? '这是一段非常长的话这是一段非常长的话这是一段非常长的话这是一段非常长的话' : undefined,
  status: id % 3,
});
const generateList = ({ pageNum, pageSize }) => {
  const start = (pageNum - 1) * pageSize;
  return Array.from({ length: pageSize }).map((_, index) => generateDetail({
    id: `${start + index + 1}`,
  }));
};

export default {
  namespace: 'specialExamination',

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
        yield call(() => new Promise((resolve) => {
          setTimeout(resolve, 1000)
        }));
        yield put({
          type: 'saveList',
          payload: list,
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
        data: generateDetail(payload),
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
    saveList: ({ list: { list: prevList, pagination: { pageNum: prevPageNum }={} }={}, ...state }, { payload: { list, pagination, pagination: { pageNum, pageSize } } }) => ({
      ...state,
      list: {
        list: pageNum === 1 ? list : (prevPageNum === pageNum ? prevList.slice(0, (pageNum - 1) * pageSize) : prevList).concat(list),
        pagination,
      },
    }),
  },
}
