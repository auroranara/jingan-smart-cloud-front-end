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
} from '../services/transmission';

export default {
  namespace: 'transmission',

  state: {
    list: [],
    deviceList: [],
    companyDetail: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTransmissionDevice, payload);
      const {
        data: {
          list,
          pagination: { pageNum, total },
        },
      } = response;

      const pIndex = Number.parseInt(pageNum, 10);
      const pType = typeof pIndex;
      if (pType !== 'number') {
        console.error(`pageNum in transmission.js[models] is ${pType}, not a number!`);
        return;
      }

      yield put({
        type: 'queryList',
        payload: { pageNum, list },
      });
      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下拉是否还加载数据
      if (callback) callback(total);
    },
    *fetchDetail({ payload }, { call, put }) {
      // console.log('fetchDetail');
      const response = yield call(queryTransmissionDeviceDetail, payload);
      // console.log('response', response);
      yield put({ type: 'queryDetail', payload: response.data.list });
      // console.log('fetchDetail end');
    },
    *fetchCompanyDetail({ payload }, { call, put }) {
      const response = yield call(queryCompanyDetail, payload);
      yield put({ type: 'queryCompanyDetail', payload: response.data });
    },
    *deviceAddAsync({ payload }, { call, put }) {
      const response = yield call(transmissionDeviceAdd, payload);

      const { msg, data } = response;
      const { hostList } = data;
      // 返回的新增设备，hostList属性不存在时，赋给一个空数组
      if (msg === 'success')
        yield put({ type: 'addDevice', payload: { ...data, hostList: hostList || [] } });
    },
    *deviceUpdateAsync({ payload }, { call, put }) {
      const response = yield call(transmissionDeviceUpdate, payload);

      const { msg } = response;
      const { data, transmissionId } = payload;
      // 传入的payload = { companyId, transmissionId, data: fieldsValue } fieldValue中已丢失id，所以要再传入一个id
      if (msg === 'success')
        yield put({ type: 'updateDevice', payload: { ...data, id: transmissionId } });
    },
    *deviceDeleteAsync({ payload }, { call, put }) {
      const response = yield call(transmissionDeviceDelete, payload);

      const { msg } = response;
      // console.log(response, response.code, msg, msg === 'success');
      if (msg === 'success') {
        yield put({ type: 'deleteDevice', payload: payload.transmissionId });
      }
    },
    *hostAddAsync({ payload }, { call, put }) {
      const response = yield call(transmissionHostAdd, payload);

      const { transmissionId } = payload;
      const { msg, data } = response;
      if (msg === 'success')
        yield put({ type: 'addHost', payload: { transmissionId, host: data } });
    },
    *hostUpdateAsync({ payload }, { call, put }) {
      const response = yield call(transmissionHostUpdate, payload);

      const { transmissionId, hostId, data } = payload;
      const { msg } = response;
      if (msg === 'success')
        yield put({
          type: 'updateHost',
          payload: { transmissionId, updatedHost: { ...data, id: hostId } },
        });
    },
    *hostDeleteAsync({ payload }, { call, put }) {
      const response = yield call(transmissionHostDelete, payload);

      const { transmissionId, hostId } = payload;
      const { msg } = response;
      if (msg === 'success') yield put({ type: 'deleteHost', payload: { transmissionId, hostId } });
    },
  },

  reducers: {
    queryList(state, action) {
      const { pageNum, list } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);

      return { ...state, list: nextList };
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
      console.log(state.deviceList);
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
  },
};
