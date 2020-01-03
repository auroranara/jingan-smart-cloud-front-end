import { getList, getDetail, add, edit, remove } from '@/services/lawStandard';

const item = {
  id: 1,
  companyId: 'DccBRhlrSiu9gMV7fmvizw',
  companyName: '无锡晶安智慧科技有限公司',
  publishDate: '2020-01-03',
  implementDate: '2020-01-03',
  name: '1',
  number: '1',
  organ: '1',
  synopsis:
    '内容摘要的第一段话内容摘要的第一段话内容摘要的第一段话内容摘要的第一段话内容摘要的第一段话\n内容摘要的第二段话\n内容摘要的第三段话',
  activity: '对应活动的第一段话\n对应活动的第二段话\n对应活动的第三段话',
  result: '1',
  remark: '备注的第一段话\n备注的第二段话\n备注的第三段话',
  attachment: [
    {
      name: '测试.txt',
      url: 'http://data.jingan-china.cn/hello/gsafe/file/200103-161352-3s5h.txt',
      webUrl: 'http://data.jingan-china.cn/hello/gsafe/file/200103-161352-3s5h.txt',
      dbUrl: '@@IPEXP_IMP_FILES_WEB/gsafe/file/200103-161352-3s5h.txt',
      fileName: '测试.txt',
    },
  ],
};

export default {
  namespace: 'lawStandard',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: [item],
          pagination: {
            total: 1,
            ...payload,
          },
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取详情
    *getDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDetail, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: item,
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const { attachment } = data;
        const detail = {
          ...data,
          attachment:
            attachment &&
            attachment.map((item, index) => ({ uid: -index - 1, status: 'done', ...item })),
        };
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 新增
    *add({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      // const response = yield call(edit, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call }) {
      // const response = yield call(remove, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
