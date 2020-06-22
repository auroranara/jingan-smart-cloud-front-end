import {
  queryPastStatusCount,
  beMonitorTargetTypeCountDto,
  countDangerSource,
  getTankList,
  riskPointForPage,
  monitorEquipment,
  videoList,
  getProductDevice,
  getZoneContent,
  getNotice,
  getMesageByMaterialId,
  monitorEquipmentTypeCountDto,
  fireDeviceList,
  getWZList,
  getFireDevice,
  getOnDuty,
  countByParkId,
  getInOutRecord,
  getLEDPersonCount,
  getLEDPerson,
  getLocation,
  getOneKeyAlarm,
} from '@/services/bigPlatform/chemical';
import { getHiddenDangerListForPage } from '@/services/bigPlatform/bigPlatform.js';
import { queryTankAreaList } from '@/services/baseInfo/storageAreaManagement';
import { queryAreaList, queryDangerSourceList } from '@/services/company/reservoirRegion';
import { queryStorehouseList } from '@/services/baseInfo/storehouse';
import { querySpecialEquipList } from '@/services/baseInfo/specialEquipment';
import { getList } from '@/services/gasometer';
import { getList as getPipelineList } from '@/services/pipeline';
// import { getDeviceDetail } from '@/services/alarmWorkOrder';
import { getWarningNewList } from '@/services/changeWarning';
import { fetchMonitoringDevice } from '@/services/device/monitoringDevice';
import { queryPostList } from '@/services/postManagement.js';

export default {
  namespace: 'chemical',

  state: {
    zoneContent: {},
    pastStatusCount: {},
    monitorTargetCount: [],
    monitorEquipCount: [],
    fireDeviceList: [],
    dangerSourceCount: {},
    tankList: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    monitorEquipment: [],
    riskPoint: [],
    videoList: [],
    monitorData: {},
    zoneEquip: {},
    noticeList: [],
    hiddenDangerTotal: 0,
    dangerSourceList: [],
    mesageByMaterialId: {
      gasholderManage: [],
      industryPipelines: [],
      productDevice: [],
      tankManages: [],
      warehouseInfos: [],
    },
    dangerSourceMaterials: {},
    fireDevice: [],
    fireDeviceDetail: {},
    warningNewList: [],
    onDuty: {},
    truckCount: [],
    inOutRecordList: [],
    monitoringDevice: {},
    LEDPersonCount: {},
    LEDPerson: {},
    oneKeyAlarm: [],
    locations: [],
    postList: [],
  },

  effects: {
    // 到期提醒数量
    *fetchPastStatusCount({ payload, callback }, { call, put }) {
      const response = yield call(queryPastStatusCount, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const pastStatusCount = data;
        yield put({
          type: 'save',
          payload: {
            pastStatusCount,
          },
        });
      }
      callback && callback(response);
    },
    // 统计监测对象各个类型的数量
    *fetchMonitorTargetCount({ payload, callback }, { call, put }) {
      const response = yield call(beMonitorTargetTypeCountDto, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: monitorTargetCount } = data;
        yield put({
          type: 'save',
          payload: {
            monitorTargetCount,
          },
        });
      }
      callback && callback(response);
    },
    // 统计IoT监测各个类型的数量
    *fetchMonitorEquipCount({ payload, callback }, { call, put }) {
      const response = yield call(monitorEquipmentTypeCountDto, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: monitorEquipCount } = data;
        yield put({
          type: 'save',
          payload: {
            monitorEquipCount,
          },
        });
      }
      callback && callback(response);
    },
    // 消防主机列表
    *fetchFireDeviceList({ payload, callback }, { call, put }) {
      const response = yield call(fireDeviceList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: fireDeviceList } = data;
        yield put({
          type: 'save',
          payload: {
            fireDeviceList,
          },
        });
      }
      callback && callback(response);
    },
    // 两重点一重大的数量
    *fetchCountDangerSource({ payload, callback }, { call, put }) {
      const response = yield call(countDangerSource, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const dangerSourceCount = data;
        yield put({
          type: 'save',
          payload: {
            dangerSourceCount,
          },
        });
      }
      callback && callback(response);
    },
    // app储罐列表
    *fetchTankList({ payload, callback }, { call, put }) {
      const response = yield call(getTankList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'saveTankList',
          payload: {
            ...data,
            append: payload.pageNum !== 1,
          },
        });
      }
      callback && callback(response);
    },
    // 风险点列表
    *fetchRiskPoint({ payload, callback }, { call, put }) {
      const response = yield call(riskPointForPage, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const riskPoint = data.list;
        yield put({
          type: 'save',
          payload: {
            riskPoint,
          },
        });
      }
      callback && callback(response);
    },
    // 监测设备列表
    *fetchMonitorEquipment({ payload, callback }, { call, put }) {
      const response = yield call(monitorEquipment, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const monitorEquipment = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorEquipment,
          },
        });
      }
      callback && callback(response);
    },
    // 分区监测设备列表
    *fetchZoneEquip({ payload, callback }, { call, put }) {
      const { equipmentType } = payload;
      const response = yield call(monitorEquipment, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const { list } = data;
        yield put({
          type: 'saveZoneEquip',
          payload: {
            list,
            equipmentType,
          },
        });
      }
      callback && callback(response);
    },
    // 视频监测列表
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(videoList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const videoList = data.list.filter(item => +item.status === 1);
        yield put({
          type: 'save',
          payload: {
            videoList,
          },
        });
      }
      callback && callback(response);
    },
    // 区域信息
    *fetchZoneContent({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          zoneContent: {},
        },
      });
      const response = yield call(getZoneContent, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const zoneContent = data;
        yield put({
          type: 'save',
          payload: {
            zoneContent,
          },
        });
      }
      callback && callback(response);
    },
    // 区域信息
    *fetchNotice({ payload, callback }, { call, put }) {
      const response = yield call(getNotice, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const noticeList = data.list;
        yield put({
          type: 'save',
          payload: {
            noticeList,
          },
        });
      }
      callback && callback(response);
    },
    // 隐患总数
    *fetchHiddenDangerTotal({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerListForPage, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const {
          pagination: { total: hiddenDangerTotal },
        } = data;
        yield put({
          type: 'save',
          payload: {
            hiddenDangerTotal,
          },
        });
      }
      callback && callback(response);
    },
    // 监测对象列表
    *fetchMonitorData({ payload, callback }, { call, put }) {
      const { monitorType } = payload;
      let callServices;
      switch (monitorType) {
        case '301':
          // 储罐区
          callServices = queryTankAreaList;
          break;
        case '302':
          // 储罐
          callServices = getTankList;
          break;
        case '303':
          // 库区
          callServices = queryAreaList;
          break;
        case '304':
          // 库房
          callServices = queryStorehouseList;
          break;
        case '305':
          // 高危工艺
          callServices = getTankList;
          break;
        case '306':
          // 特种设备
          callServices = querySpecialEquipList;
          break;
        case '311':
          // 生产装置
          callServices = getProductDevice;
          break;
        case '312':
          // 气柜
          callServices = getList;
          break;
        case '314':
          // 气柜
          callServices = getPipelineList;
          break;
        default:
          callServices = getTankList;
          break;
      }
      const response = yield call(callServices, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveMonitorData',
          payload: {
            list: data.list,
            monitorType,
          },
        });
      }
      callback && callback(response);
    },
    // 重大危险源列表
    *fetchDangerSourceList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerSourceList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const dangerSourceList = data.list;
        yield put({
          type: 'save',
          payload: {
            dangerSourceList,
          },
        });
      }
      callback && callback(response);
    },
    // 重点监管危化品生产存储场所
    *fetchMesageByMaterialId({ payload, callback }, { call, put }) {
      const response = yield call(getMesageByMaterialId, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const mesageByMaterialId = data;
        yield put({
          type: 'save',
          payload: {
            mesageByMaterialId,
          },
        });
      }
      callback && callback(response);
    },
    // 重大危险源存储物质
    *fetchDangerSourceMaterials({ payload, callback }, { call, put }) {
      const response = yield call(getWZList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const dangerSourceMaterials = data;
        yield put({
          type: 'save',
          payload: {
            dangerSourceMaterials,
          },
        });
      }
      callback && callback(response);
    },
    // 获取消防主机点位
    *fetchFireDevice({ payload, callback }, { call, put }) {
      const response = yield call(getFireDevice, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const fireDevice = data.list;
        yield put({
          type: 'save',
          payload: {
            fireDevice,
          },
        });
      }
      callback && callback(response);
    },
    // 消防主机详情
    *fetchFireDeviceDetail({ payload, callback }, { call, put }) {
      const response = yield call(fireDeviceList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: fireDeviceList = [] } = data;
        const fireDeviceDetail = fireDeviceList[0] || {};
        yield put({
          type: 'save',
          payload: {
            fireDeviceDetail,
          },
        });
      }
      callback && callback(response);
    },
    // 消防主机详情
    *fetchWarningNewList({ payload, callback }, { call, put }) {
      const response = yield call(getWarningNewList, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: warningNewList = [] } = data;
        yield put({
          type: 'save',
          payload: {
            warningNewList,
          },
        });
      }
      callback && callback(response);
    },
    // 获取人员在岗在位
    *fetchOnDuty({ payload, callback }, { call, put }) {
      const response = yield call(getOnDuty, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const onDuty = data;
        yield put({
          type: 'save',
          payload: {
            onDuty,
          },
        });
      }
      callback && callback(response);
    },
    // 获取人员在岗在位
    *fetchCountByParkId({ payload, callback }, { call, put }) {
      const response = yield call(countByParkId, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const truckCount = data.data;
        yield put({
          type: 'save',
          payload: {
            truckCount,
          },
        });
      }
      callback && callback(response);
    },
    // 获取人员在岗在位
    *fetchInOutRecord({ payload, callback }, { call, put }) {
      const response = yield call(getInOutRecord, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const inOutRecordList = data.list;
        yield put({
          type: 'save',
          payload: {
            inOutRecordList,
          },
        });
      }
      callback && callback(response);
    },
    // 获取监测设备列表（分页）
    *fetchMonitoringDevice({ payload, callback }, { call, put }) {
      const res = yield call(fetchMonitoringDevice, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'saveMonitoringDevice',
          payload: { list: res.data.list || [], id: payload.selfTargetId },
        });
        callback && callback(res.data.list);
      }
    },
    *fetchLEDPersonCount({ payload, callback }, { call, put }) {
      const res = yield call(getLEDPersonCount, payload);
      const { code, data } = res || {};
      if (code === 200) {
        yield put({ type: 'saveLEDPersonCount', payload: data || {} });
        callback && callback(data);
      }
    },
    *fetchLEDPerson({ payload, callback }, { call, put }) {
      const res = yield call(getLEDPerson, payload);
      const { code, data } = res || {};
      if (code === 200) {
        yield put({ type: 'saveLEDPerson', payload: data || {} });
        callback && callback(data);
      }
    },
    // 定位数据
    *getLocation({ payload, callback }, { call, put }) {
      const response = yield call(getLocation, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const locations = data.list;
        yield put({
          type: 'save',
          payload: {
            locations,
          },
        });
      }
      callback && callback(response);
    },
    // 定位报警数据
    *getOneKeyAlarm({ payload, callback }, { call, put }) {
      const response = yield call(getOneKeyAlarm, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const oneKeyAlarm = data.list;
        yield put({
          type: 'save',
          payload: {
            oneKeyAlarm,
          },
        });
      }
      callback && callback(response);
    },
    // 岗位列表
    *fetchPostList({ payload, callback }, { call, put }) {
      const response = yield call(queryPostList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const postList = data.list;
        yield put({
          type: 'save',
          payload: {
            postList,
          },
        });
      }
      callback && callback(response);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveTankList: (state, { payload, append }) => ({
      ...state,
      tankList: {
        list: append ? state.tankList.list.concat(payload.list) : payload.list,
        pagination: payload.pagination,
      },
    }),
    saveMonitorData: (state, { payload: { list, monitorType } }) => ({
      ...state,
      monitorData: {
        ...state.monitorData,
        [monitorType]: list,
      },
    }),
    saveZoneEquip: (state, { payload: { list, equipmentType } }) => ({
      ...state,
      zoneEquip: {
        ...state.zoneEquip,
        [equipmentType]: list,
      },
    }),
    saveMonitoringDevice: (state, { payload: { list, id } }) => ({
      ...state,
      monitoringDevice: {
        ...state.monitoringDevice,
        [id]: list,
      },
    }),
    saveLEDPersonCount(state, action) {
      return { ...state, LEDPersonCount: action.payload };
    },
    saveLEDPerson(state, action) {
      return { ...state, LEDPerson: action.payload };
    },
  },
};
