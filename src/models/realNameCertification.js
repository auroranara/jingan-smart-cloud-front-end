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
  fetchChannelDeviceList,
  addChannelDevice,
  editChannelDevice,
  deleteChannelDevice,
  fetchChannelList,
  refreshChannelDevice,
  restartChannelDevice,
  disabledChannelDevice,
  enableChannelDevice,
  addChannel,
  editChannel,
  deleteChannel,
  queryTagCardList,
  queryTagCardAdd,
  queryTagCardEdit,
  queryTagCardDel,
  queryTagExport,
  queryPersonExport,
  queryRecordList,
} from '@/services/realNameCertification';
import fileDownload from 'js-file-download';
import moment from 'moment';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

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
    authSearchInfo: {},
    // 通道数据
    channel: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    channelSearchInfo: {},
    // 通道设备
    channelDevice: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    deviceSearchInfo: {},
    // 设备数据
    device: {
      list: [
        // {
        //   appId: "76C6F1217A3A47DFA10B006C672FD86D",
        //   deviceKey: "84E0F421C21F08FA",
        //   tag: "",
        //   name: "测试",
        //   state: 2,
        //   onlineState: 1,
        //   versionNo: "6.0079",
        //   lastActiveTime: "2020-02-27T07:37:02+0000",
        //   createTime: "2020-01-19T06:59:28+0000",
        //   type: 2,
        //   recType: 1,
        //   recMode: "人脸识别/人卡合一",
        // },
        // {
        //   appId: "76C6F1217A3A47DFA10B006C672FD86D",
        //   deviceKey: "84E0F422C3BB527A",
        //   tag: "",
        //   name: "入口",
        //   state: 2,
        //   onlineState: 1,
        //   versionNo: "6.0079",
        //   lastActiveTime: "2020-02-27T07:37:02+0000",
        //   createTime: "2020-01-19T06:59:28+0000",
        //   type: 2,
        //   recType: 1,
        //   recMode: "人脸识别/人卡合一",
        // },
        // {
        //   appId: "76C6F1217A3A47DFA10B006C672FD86D",
        //   deviceKey: "84E0F422C8B4527A",
        //   tag: "",
        //   name: "出口",
        //   state: 2,
        //   onlineState: 1,
        //   versionNo: "6.0079",
        //   lastActiveTime: "2020-02-27T07:37:02+0000",
        //   createTime: "2020-01-19T06:59:28+0000",
        //   type: 2,
        //   recType: 1,
        //   recMode: "人脸识别/人卡合一",
        // },
      ],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 识别记录数据
    identification: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    idenSearchInfo: {},
    // 人员类型字典
    personTypeDict: [
      // { key: '4', value: '操作人员' },
      // { key: '5', value: '管理人员' },
      // { key: '6', value: '安全巡查人员' },
      { key: '1', value: '单位人员' },
      { key: '2', value: '外协人员' },
      { key: '3', value: '临时人员' },
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
      { key: '52', label: 'DV300平板' },
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
    // 照片状态字典
    picStateDict: [
      { value: 1, label: '授权成功' },
      { value: 2, label: '销权中' },
      { value: 3, label: '授权中（可能原因：设备离线）' },
    ],
    // 通道类型字典
    channelTypeDict: [{ key: '1', value: '双向' }, { key: '2', value: '单向' }],
    // 在线状态字典
    onlineStateDict: [{ key: '1', value: '在线' }, { key: '2', value: '不在线', color: 'red' }],
    // 方向字典
    directionDict: [{ key: '1', value: '出口' }, { key: '2', value: '入口' }],
    // 标签卡列表数据
    tagCardData: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 标签卡详情数据
    tagCarDetail: {
      data: [],
    },
    // 导入照片记录
    record: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
  },
  effects: {
    // 获取企业列表
    *fetchCompanyList ({ payload }, { call, put }) {
      const res = yield call(fetchCompanyList, payload);
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveCompany',
          payload: res.data,
        });
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
    *fetchPersonList ({ payload, callback }, { call, put }) {
      const res = yield call(fetchPersonList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'savePerson',
          payload: res.data,
        });
        if (callback) callback(res);
      }
    },
    // 删除人员
    *deletePerson ({ payload, callback }, { call }) {
      const res = yield call(deletePerson, payload);
      callback && callback(res && res.code === 200);
    },
    // 批量导入照片记录
    *fetchRecordList ({ payload }, { call, put }) {
      const res = yield call(queryRecordList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveRecord',
          payload: res.data,
        });
      }
    },
    // 导出人员列表
    *fetchPersonExport ({ payload }, { call }) {
      const blob = yield call(queryPersonExport, payload);
      fileDownload(blob, `人员_${moment().format('YYYYMMDD')}.xls`);
    },
    // 获取详情
    *fetchDetail ({ payload, callback }, { call }) {
      const res = yield call(fetchPersonList, payload);
      if (res && res.code === 200 && res.data) {
        callback && callback(res.data.list[0]);
      } else if (callback) callback({});
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
        });
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
        });
      }
    },
    // 获取通道设备列表
    *fetchChannelDeviceList ({ payload }, { call, put }) {
      const res = yield call(fetchChannelDeviceList, payload);
      yield put({
        type: 'saveChannelDevice',
        payload:
          res && res.code === 200 && res.data ? res.data : { list: [], ...defaultData.pagination },
      });
    },
    // 新增通道设备
    *addChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(addChannelDevice, payload);
      const { data: { result, msg } = {} } = res;
      callback && callback(res && !!result, msg);
    },
    // 编辑通道设备
    *editChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(editChannelDevice, payload);
      const { data: { result, msg } = {} } = res;
      callback && callback(res && !!result, msg);
    },
    // 删除通道设备
    *deleteChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(deleteChannelDevice, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取设备详情
    *fetchDeviceDetail ({ payload, callback }, { call }) {
      const res = yield call(fetchChannelDeviceList, { ...payload, pageNum: 1, pageSize: 10 });
      const detail = res && res.code === 200 && res.data ? res.data.list[0] : {};
      callback && callback(res && res.code === 200, detail);
    },
    // 获取通道列表
    *fetchChannelList ({ payload }, { call, put }) {
      const res = yield call(fetchChannelList, payload);
      yield put({
        type: 'saveChannel',
        payload:
          res && res.code === 200 && res.data ? res.data : { list: [], ...defaultData.pagination },
      });
    },
    // 获取通道详情
    *fetchChannelDetail ({ payload, callback }, { call }) {
      const res = yield call(fetchChannelList, { ...payload, pageNum: 1, pageSize: 10 });
      const detail = res && res.code === 200 && res.data ? res.data.list[0] : {};
      callback && callback(res && res.code === 200, detail);
    },
    // 刷新通道设备
    *refreshChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(refreshChannelDevice, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 重启通道设备
    *restartChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(restartChannelDevice, payload);
      const { data: { result, msg } = {} } = res;
      callback && callback(res && !!result, msg);
    },
    // 禁用通道设备
    *disabledChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(disabledChannelDevice, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 启用通道设备
    *enableChannelDevice ({ payload, callback }, { call }) {
      const res = yield call(enableChannelDevice, payload);
      const { data: { result, msg } = {} } = res;
      callback && callback(res && !!result, msg);
    },
    // 新增通道
    *addChannel ({ payload, callback }, { call }) {
      const res = yield call(addChannel, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 编辑通道
    *editChannel ({ payload, callback }, { call }) {
      const res = yield call(editChannel, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 删除通道
    *deleteChannel ({ payload, callback }, { call }) {
      const res = yield call(deleteChannel, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 标签卡列表
    *fetchTagCardList ({ payload, callback }, { call, put }) {
      const response = yield call(queryTagCardList, { ...payload });
      if (response && response.code === 200) {
        yield put({
          type: 'saveTagCardList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    // 新增标签卡
    *fetchTagCardAdd ({ payload, callback }, { call, put }) {
      const response = yield call(queryTagCardAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveTagCardAdd', payload: data });
      }
      if (callback) callback(response && response.code === 200, response.msg);
    },

    // 修改标签卡
    *fetchTagCardEdit ({ payload, callback }, { call, put }) {
      const response = yield call(queryTagCardEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveTagCardEdit', payload: response.data });
      }
      if (callback) callback(response && response.code === 200, response.msg);
    },

    // 删除标签卡
    *fetchTagCardDel ({ payload, callback }, { put, call }) {
      const response = yield call(queryTagCardDel, payload);
      if (response.code === 200) {
        yield put({ type: 'saveTagCardDel', payload: payload.id });
      }
      if (callback) callback(response && response.code === 200, response.msg);
    },

    // 导出标签卡
    *fetchTagExport ({ payload }, { call }) {
      const blob = yield call(queryTagExport, payload);
      fileDownload(blob, `标签卡_${moment().format('YYYYMMDD')}.xls`);
    },
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      };
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
      };
    },
    savePerson (state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        person: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveAuthorization (state, { payload = {} }) {
      const { content: list = [], index: pageNum = 1, length: pageSize = 10, total = 0 } = payload;
      return {
        ...state,
        authorization: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveRecord (state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        record: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveIdentificationRecord (state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        identification: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveChannelDevice (state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        channelDevice: {
          list: list.map(item => ({ ...item, deviceKey: item.deviceCode })),
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveDeviceSearchInfo (state, action) {
      return {
        ...state,
        deviceSearchInfo: action.payload || {},
      };
    },
    saveChannelSearchInfo (state, action) {
      return {
        ...state,
        channelSearchInfo: action.payload || {},
      };
    },
    saveChannel (state, { payload = {} }) {
      const { list = [], pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} } = payload;
      return {
        ...state,
        channel: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveAuthSearchInfo (state, action) {
      return {
        ...state,
        authSearchInfo: action.payload || {},
      };
    },
    saveIdenSearchInfo (state, action) {
      return {
        ...state,
        idenSearchInfo: action.payload || {},
      };
    },
    saveTagCardList (state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        tagCardData: data,
      };
    },

    saveTagCardAdd (state, { payload }) {
      return {
        ...state,
        tagCarDetail: payload,
      };
    },

    saveTagCardEdit (state, { payload }) {
      return {
        ...state,
        tagCarDetail: {
          ...state.tagCarDetail,
          data: payload,
        },
      };
    },

    saveTagCardDel (state, { payload: id }) {
      return {
        ...state,
        tagCardData: {
          ...state.tagCardData,
          list: state.tagCardData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
