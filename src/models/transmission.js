// import moment from 'moment';

import {
  queryTransmissionDevice,
  queryTransmissionDeviceDetail,
  queryCompanyDetail,
  transmissionDeviceAdd,
  transmissionDeviceUpdate,
  transmissionDeviceDelete,
  transmissionHostAdd,
  transmissionHostUpdate,
  transmissionHostDelete,
  fetchPoints,
  editPoint,
  deletePoint,
  addPoint,
} from '../services/transmission';
import { fetchDictList } from '../services/videoMonitor'

export default {
  namespace: 'transmission',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
      transmissionCount: '',
    },
    list: [],
    pageNum: 1,
    isLast: false,
    deviceList: [],
    companyDetail: {},
    selectCompany: { pagination: {} },
    facilityTypes: [], // 设施类型
    componentTypes: [], // 部件类型
    // 点位管理
    pointManagement: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTransmissionDevice, payload);
      const {
        code,
        data: {
          pagination: { total },
        },
      } = response;

      // const pIndex = Number.parseInt(pageNum, 10);
      // const pType = typeof pIndex;
      // if (pType !== 'number') {
      //   console.error(`pageNum in transmission.js[models] is ${pType}, not a number!`);
      //   return;
      // }

      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下拉是否还加载数据
      if (callback) callback(total);

      if (code !== 200) return;

      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      // console.log('fetchDetail');
      const response = yield call(queryTransmissionDeviceDetail, payload);
      // console.log('response', response);
      const { code } = response;
      if (callback) callback(code);
      if (code !== 200) return;

      const list = response.data.list.map(item => ({
        ...item.transmissionDevice,
        hostList: item.fireDevices,
      }));
      yield put({ type: 'queryDetail', payload: list });
      // console.log('fetchDetail end');
    },
    *fetchCompanyDetail({ payload }, { call, put }) {
      const response = yield call(queryCompanyDetail, payload);
      const { code } = response;
      if (code !== 200) return;

      yield put({ type: 'queryCompanyDetail', payload: response.data });
    },
    *deviceAddAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionDeviceAdd, payload);
      const { code, data, msg } = response;
      const responseData = data || {};
      const { hostList } = responseData;
      if (callback) callback(code, '添加成功', '添加失败', msg);

      // 返回的新增设备，hostList属性不存在时，赋给一个空数组
      if (code === 200)
        yield put({ type: 'addDevice', payload: { ...data, hostList: hostList || [] } });
    },
    *deviceUpdateAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionDeviceUpdate, payload);

      const { code, msg } = response;
      const { data, transmissionId } = payload;
      // 传入的payload = { companyId, transmissionId, data: fieldsValue } fieldValue中已丢失id，所以要再传入一个id
      if (code === 200)
        yield put({ type: 'updateDevice', payload: { ...data, id: transmissionId } });

      if (callback) callback(code, '更新成功', '更新失败', msg);
    },
    *deviceDeleteAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionDeviceDelete, payload);

      const { code, msg } = response;
      // console.log(response, response.code, msg, msg === 'success');
      if (code === 200) yield put({ type: 'deleteDevice', payload: payload.transmissionId });

      if (callback) callback(code, '删除成功', '删除失败', msg);
    },
    *hostAddAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionHostAdd, payload);

      const { transmissionId } = payload;
      const { code, data, msg } = response;
      if (code === 200) yield put({ type: 'addHost', payload: { transmissionId, host: data } });

      if (callback) callback(code, '添加成功', '添加失败', msg);
    },
    *hostUpdateAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionHostUpdate, payload);

      const { transmissionId, hostId, data } = payload;
      const { code, msg } = response;
      if (code === 200)
        yield put({
          type: 'updateHost',
          payload: { transmissionId, updatedHost: { ...data, id: hostId } },
        });

      if (callback) callback(code, '更新成功', '更新失败', msg);
    },
    *hostDeleteAsync({ payload, callback }, { call, put }) {
      const response = yield call(transmissionHostDelete, payload);

      const { transmissionId, hostId } = payload;
      const { code, msg } = response;
      if (code === 200) yield put({ type: 'deleteHost', payload: { transmissionId, hostId } });

      if (callback) callback(code, '删除成功', '删除失败', msg);
    },
    *fetchSelectCompany({ payload }, { call, put }) {
      let response = yield call(queryTransmissionDevice, payload);
      response = response || {};
      const { code = 500, data = {} } = response;
      if (code === 200)
        yield put({ type: 'saveSelectCompany', payload: data });
    },
    // 获取设施类型、部件类型
    *fetchDictList({ payload }, { call, put }) {
      const response = yield call(fetchDictList, { type: 'systemcode' });
      if (response) {
        yield put({
          type: 'save',
          payload: { facilityTypes: response.result || [] },
        });
      }
      const res = yield call(fetchDictList, { type: 'componentType' });
      if (res) {
        yield put({
          type: 'save',
          payload: { componentTypes: res.result || [] },
        });
      }
    },
    // 获取点位列表
    *fetchPoints({ payload, callback }, { call, put }) {
      const res = yield call(fetchPoints, payload)
      if (res && res.code === 200) {
        const { list = [], pageNum = 1, pageSize = 10, total = 0 } = res.data || {}
        yield put({
          type: 'save',
          payload: {
            pointManagement: {
              list,
              pagination: { pageNum, pageSize, total },
            },
          },
        })
        if (callback) callback(res.data)
      }
    },
    // 编辑点位
    *editPoint({ payload, success, error }, { call }) {
      const res = yield call(editPoint, payload)
      if (res && res.code === 200 && success) {
        success()
      } else error(res)
    },
    // 删除点位
    *deletePoint({ payload, success, error }, { call }) {
      const res = yield call(deletePoint, payload)
      if (res && res.code === 200 && success) {
        success()
      } else error(res)
    },
    // 新增点位
    *addPoint({ payload, success, error }, { call }) {
      const res = yield call(addPoint, payload)
      if (res && res.code === 200 && success) {
        success()
      } else error(res)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    queryList(state, action) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
        transmissionCount,
      } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        data: {
          list: nextList,
          pagination,
          transmissionCount,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryDetail(state, action) {
      // console.log('action.payload', action.payload);
      return { ...state, deviceList: action.payload };
    },
    queryCompanyDetail(state, action) {
      return { ...state, companyDetail: action.payload };
    },
    addDevice(state, action) {
      return { ...state, deviceList: [action.payload, ...state.deviceList] };
    },
    updateDevice(state, action) {
      const updatedDevice = action.payload;
      const nextDeviceList = state.deviceList.map(d => {
        // 不能直接返回device，因为传入device实际是fieldsValue，除了表单相关属性，其余的deviceData上的属性都丢失了，包括hostList
        // 若直接返回了device，则会是hostList的信息全部丢失，显示没有消防主机
        if (d.id === updatedDevice.id) return { ...d, ...updatedDevice };
        return d;
      });
      return { ...state, deviceList: nextDeviceList };
    },
    deleteDevice(state, action) {
      const { payload: transmissionId } = action;
      // console.log(action, transmissionId);
      // 把需要删除的transmissionId对应的设备过滤掉，下面host同理
      return { ...state, deviceList: state.deviceList.filter(d => d.id !== transmissionId) };
    },
    addHost(state, action) {
      const {
        payload: { transmissionId, host },
      } = action;
      // console.log(action.payload);
      // console.log(state.deviceList);
      const nextDeviceList = state.deviceList.map(d => {
        if (d.id !== transmissionId) return d;
        return { ...d, hostList: [host, ...d.hostList] };
      });

      return { ...state, deviceList: nextDeviceList };
    },
    updateHost(state, action) {
      const {
        payload: { transmissionId, updatedHost },
      } = action;
      const nextDeviceList = state.deviceList.map(d => {
        if (d.id !== transmissionId) return d;
        const newHostList = d.hostList.map(h => {
          if (h.id !== updatedHost.id) return h;
          return { ...h, ...updatedHost };
        });
        return { ...d, hostList: newHostList };
      });

      return { ...state, deviceList: nextDeviceList };
    },
    deleteHost(state, action) {
      const {
        payload: { transmissionId, hostId },
      } = action;
      const nextDeviceList = state.deviceList.map(d => {
        if (d.id !== transmissionId) return d;
        return { ...d, hostList: d.hostList.filter(h => h.id !== hostId) };
      });

      return { ...state, deviceList: nextDeviceList };
    },
    saveSelectCompany(state, action) {
      return { ...state, selectCompany: action.payload };
    },
  },
};
