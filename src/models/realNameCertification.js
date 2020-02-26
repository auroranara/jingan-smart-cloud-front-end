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
    // 单位数据
    company: {
      list: [
        {
          companyId: "DccBRhlrSiu9gMV7fmvizw",
          count: 1,
          companyMessage: {
            name: '无锡晶安智慧科技有限公司',
            safetyName: '张丽',
            safetyPhone: '13852145201',
            practicalProvinceLabel: '江苏省',
            practicalCityLabel: '无锡市',
            practicalDistrictLabel: '市辖区',
            practicalTownLabel: null,
            practicalAddress: null,
          },
        },
      ],
      pagination: { pageNum: 1, pageSize: 18, total: 1 },
      isLast: true,
    },
    // 人员数据
    person: {
      list: [
        {
          id: "31ud_u2b79jsdhdq",
          remarks: null,
          companyId: "DccBRhlrSiu9gMV7fmvizw",
          name: "测试",
          sex: "0",
          ethnic: "汉",
          certificateType: "汉",
          certificateNumber: null,
          birthday: null,
          location: null,
          address: null,
          telephone: "13815205588",
          email: null,
          personType: "1",
          personCompany: "测试单位",
          duty: "1",
          workType: null,
          education: "0",
          major: null,
          icnumber: "202002260913",
          entranceNumber: "1413052022",
          photo: "yaqj666bxokdt1pa",
          educationCertificate: "",
          guid: "67BB1EE3F0844928BA32BD8BB496A3F7",
          photoDetails: [
            {
              id: "yaqj666bxokdt1pa",
              remarks: null,
              dbUrl: "@@IPEXP_IMP_FILES_WEB/gsafe/realname/200225-165746-eg6v.jpg",
              fileName: "人脸照片.jpg",
              webUrl: "http://data.jingan-china.cn/hello/gsafe/realname/200225-165746-eg6v.jpg",
              photoGuid: "C7625D0C7FA64405B85CA0CAEB9B9025",
              name: "人脸照片.jpg",
            },
          ],
          educationCertificateDetails: [],
          companyName: "无锡晶安智慧科技有限公司",
        },
      ],
      pagination: { pageNum: 1, pageSize: 18, total: 1 },
      isLast: true,
    },
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
