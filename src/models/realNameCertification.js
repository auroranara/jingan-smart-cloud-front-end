import {
  fetchCompanyList,
  fetchPersonList,
  addPerson,
  editPerson,
  deletePerson,
} from '@/services/realNameCertification';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 18, total: 0 },
  isLast: true,
};

export default {
  namespace: 'realNameCertification',
  state: {
    company: defaultData, // 单位数据
    person: defaultData, // 人员数据
    personTypeDict: [ // 人员类型字典
      { key: '1', label: '员工' },
      { key: '2', label: '外协人员' },
      { key: '3', label: '临时人员' },
    ],
    dutyDict: [ // 职务字典
      { key: '1', label: '安全员' },
      { key: '2', label: '安全管理员' },
      { key: '3', label: '主要负责人' },
      { key: '4', label: '法定代表人' },
      { key: '5', label: '其他' },
    ],
  },
  effects: {
    // 获取企业列表
    *fetchCompanyList ({ payload }, { call, put }) {
      const res = yield call(fetchCompanyList, payload);
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveCompany',
          payload: res.data,
        })
      }
    },
    // 新增人员
    *addPerson ({ payload, callback }, { call }) {
      const res = yield call(addPerson, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 编辑人员
    *editPerson ({ payload, callback }, { call }) {
      const res = yield call(editPerson, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取人员列表
    *fetchPersonList ({ payload }, { call, put }) {
      const res = yield call(fetchPersonList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'savePerson',
          payload: res.data,
        })
      }
    },
    // 删除人员
    *deletePerson ({ payload, callback }, { call }) {
      const res = yield call(deletePerson, payload);
      callback && callback(res && res.code === 200);
    },
    // 获取详情
    *fetchDetail ({ payload, callback }, { call }) {
      const res = yield call(fetchPersonList, payload);
      if (res && res.code === 200 && res.data) {
        callback && callback(res.data.list[0])
      } else if (callback) callback({})
    },
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    saveCompany (state, action) {
      const { list = [], pageNum = 1, pageSize = 10, total = 0 } = action.payload;
      return {
        ...state,
        company: {
          list: pageNum === 1 ? list : [...state.company.list, ...list],
          pagination: { pageNum, pageSize, total },
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    savePerson (state, action) {
      const { list = [], pageNum = 1, pageSize = 10, total = 0 } = action.payload;
      return {
        ...state,
        person: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    },
  },
}
