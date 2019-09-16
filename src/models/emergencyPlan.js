import {
  getList,
  getHistory,
  getDetail,
  add,
  edit,
} from '@/services/emergencyPlan';

export default {
  namespace: 'emergencyPlan',

  state: {
    list: {},
    history: {},
    detail: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: 1,
              companyName: '无锡晶安智慧科技有限公司',
              name: '预案名称1',
              majorHazard: 1,
              applicationArea: '消防单位',
              versionType: 1,
              version: 1.01,
              expiryDate: +new Date(),
              typeCode: '66A00 综合应急预案',
              securityCode: '机密',
              recordStatus: 1,
              recordNumber: 1234124,
              recordDate: +new Date(),
              recordCredential: {
                name: '县应急部门备案证明.jpg',
                webUrl: 'https://lanhuapp.com/web/#/item/project/product?pid=77eadb05-cd62-4828-bd65-3384766a05d4&docId=27f3d2ee-21fd-4958-bcdd-d882e86d0390&docType=axure&pageId=5bfc27c34a6d40c0b6a7d16ecdd609e9&image_id=27f3d2ee-21fd-4958-bcdd-d882e86d0390&parentId=13cb8183659c4b2989a882f93b50d683',
              },
              attachment: {
                name: '县应急部门备案证明.jpg',
                webUrl: 'https://lanhuapp.com/web/#/item/project/product?pid=77eadb05-cd62-4828-bd65-3384766a05d4&docId=27f3d2ee-21fd-4958-bcdd-d882e86d0390&docType=axure&pageId=5bfc27c34a6d40c0b6a7d16ecdd609e9&image_id=27f3d2ee-21fd-4958-bcdd-d882e86d0390&parentId=13cb8183659c4b2989a882f93b50d683',
              },
              auditStatus: 0,
              publishStatus: 0,
              history: [
                {
                  id: 1,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 2,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 3,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 4,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 5,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 6,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
                {
                  id: 7,
                  version: 1.01,
                  status: 0,
                  createTime: +new Date(),
                  createPerson: 'sk',
                  auditPassTime: +new Date(),
                  auditPerson: 'sk',
                  publishTime: +new Date(),
                  publishPerson: 'sk',
                },
              ],
            },
          ],
          pagination: {
            pageSize: 10,
            pageNum: 1,
            total: 1,
          },
        },
      };
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            list: data || {},
          },
        });
      }
    },
    *fetchHistory({ payload }, { call, put }) {
      // const response = yield call(getHistory, payload);
      const response = {
        code: 200,
        data: {

        },
      };
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            history: data || {},
          },
        });
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDetail, payload);
      const response = {
        code: 200,
        data: {
          companyId: '1',
          companyName: '无锡晶安智慧科技有限公司',
        },
      };
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            detail: data || {},
          },
        });
        callback && callback(data);
      }
    },
    *add({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      const response = {
        code: 200,
      };
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *edit({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      const response = {
        code: 200,
      };
      const { code } = response || {};
      callback && callback(code === 200);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
