import {
  fetchCompanyList,
  fetchPersonList,
  addPerson,
  editPerson,
  deletePerson,
  authorizationPerson,
  fetchAuthorizationList,
  deleteAllAuthorization,
  deleteAuthorization,
  fetchIdentificationRecord,
} from '@/services/realNameCertification';

export default {
  namespace: 'realNameCertification',
  state: {
    // 单位数据
    company: {
      list: [],
      pagination: { pageNum: 1, pageSize: 18, total: 0 },
      isLast: true,
    },
    // 人员数据
    person: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 授权数据
    authorization: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 设备数据
    device: {
      list: [
        {
          appId: "76C6F1217A3A47DFA10B006C672FD86D",
          deviceKey: "84E0F421C21F08FA",
          tag: "",
          name: "测试",
          state: 2,
          onlineState: 1,
          versionNo: "6.0079",
          lastActiveTime: "2020-02-27T07:37:02+0000",
          createTime: "2020-01-19T06:59:28+0000",
          type: 2,
          recType: 1,
          recMode: "人脸识别/人卡合一",
        },
      ],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 识别记录数据
    identification: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 人员类型字典
    personTypeDict: [
      { key: '1', label: '员工' },
      { key: '2', label: '外协人员' },
      { key: '3', label: '临时人员' },
    ],
    // 职务字典
    dutyDict: [
      { key: '1', label: '安全员' },
      { key: '2', label: '安全管理员' },
      { key: '3', label: '主要负责人' },
      { key: '4', label: '法定代表人' },
      { key: '5', label: '其他' },
    ],
    // 储存位置字典
    storageLocationDict: [
      { key: '1', label: '本地', value: '1' },
      // { key: '2', label: '云端', value: '2' },
    ],
    // 设备类型字典
    deviceTypeDict: [
      { key: '1', label: 'Uface 1' },
      { key: '2', label: 'Uface 2' },
      { key: '3', label: 'Uface 3' },
      { key: '6', label: 'Uface C' },
      { key: '10', label: 'Uface 2C' },
    ],
    storageLocationsDict: [
      {
        value: '1',
        label: '本地',
        remark: '设备识别方式为本地，授权至本地',
      },
      // {
      //   value: '2',
      //   label: '云端',
      //   remark: '设备识别方式为云端，授权至云端',
      // },
    ],
    // 识别模式字典
    identificationDict: [
      { key: '1', label: '刷脸模式' },
      { key: '2', label: '刷卡模式' },
      { key: '3', label: '人卡合一' },
      { key: '4', label: '人证对比' },
    ],
    // 活体判断字典
    livingBodyDict: [
      { key: '1', label: '活体', color: '#2bbb59' },
      { key: '2', label: '非活体', color: 'red' },
      { key: '3', label: '未设置' },
    ],
    // 有效期判断字典
    validateDict: [
      { key: '1', label: '有效期内', color: '#2bbb59' },
      { key: '2', label: '未在有效期', color: 'red' },
      { key: '3', label: '未设置' },
    ],
    // 准入时间判断字典
    accessDict: [
      { key: '1', label: '准入时间内', color: '#2bbb59' },
      { key: '2', label: '未在准入时间', color: 'red' },
      { key: '3', label: '未设置' },
    ],
    // 人员权限字典
    permissionsDict: [
      { value: 'facePermission', label: '刷脸权限' },
      { value: 'idCardPermission', label: '刷卡权限' },
      { value: 'faceAndCardPermission', label: '人卡合一权限' },
      { value: 'idCardFacePermission', label: '认证对比权限' },
    ],
    // 照片状态
    picStateDict: [
      { value: 1, label: '授权成功' },
      { value: 2, label: '销权中' },
      { value: 3, label: '授权中（可能原因：设备离线）' },
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
    // 批量授权人员
    *authorizationPerson ({ payload, callback }, { call }) {
      const res = yield call(authorizationPerson, payload);
      if (res && res.code === 200) {
        callback(res.data);
      }
    },
    // 获取授权列表
    *fetchAuthorizationList ({ payload }, { call, put }) {
      const res = yield call(fetchAuthorizationList, payload);
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveAuthorization',
          payload: res.data.data || { content: [], index: 1, length: 10, total: 0 },
        })
      }
    },
    // 全部销权
    *deleteAllAuthorization ({ payload, callback }, { call }) {
      const res = yield call(deleteAllAuthorization, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 销权
    *deleteAuthorization ({ payload, callback }, { call }) {
      const res = yield call(deleteAuthorization, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取识别记录列表
    *fetchIdentificationRecord ({ payload }, { call, put }) {
      const res = yield call(fetchIdentificationRecord, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveIdentificationRecord',
          payload: res.data,
        })
      }
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
    saveAuthorization (state, action) {
      const { content: list = [], index: pageNum = 1, length: pageSize = 10, total = 0 } = action.payload;
      return {
        ...state,
        authorization: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    },
    saveIdentificationRecord (state, action) {
      const { list = [], pageNum = 1, pageSize = 10, total = 0 } = action.payload;
      return {
        ...state,
        identification: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    },
  },
}
