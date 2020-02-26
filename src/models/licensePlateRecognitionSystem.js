import {
  getCompanyList,
  getVehicleCompanyList,
  getCompanyVehicleCount,
  getVehicleList,
  getVehicleDetail,
  addVehicle,
  deleteVehicle,
  editVehicle,
  getParkCompanyList,
  getCompanyParkCount,
  getParkList,
  getParkDetail,
  getParkId,
  addPark,
  deletePark,
  editPark,
  getAreaCompanyList,
  getAreaList,
  getAreaDetail,
  addArea,
  deleteArea,
  editArea,
  getChannelCompanyList,
  getCompanyChannelCount,
  getChannelList,
  getChannelDetail,
  addChannel,
  deleteChannel,
  editChannel,
  getDeviceCompanyList,
  getDeviceList,
  getDeviceDetail,
  addDevice,
  deleteDevice,
  editDevice,
  setMainCamera,
  getDisplayAndVoiceConfig,
  setDisplayAndVoiceConfig,
  getPresenceRecordList,
  exportPresenceRecordList,
  getAbnormalRecordList,
  exportAbnormalRecordList,
  getLiftRecordList,
} from '@/services/licensePlateRecognitionSystem';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'licensePlateRecognitionSystem',

  state: {
    companyList: {},
    vehicleCompanyList: {},
    vehicleList: {},
    vehicleDetail: {},
    parkCompanyList: {},
    parkList: {},
    parkDetail: {},
    areaCompanyList: {},
    areaList: {},
    areaDetail: {},
    channelCompanyList: {},
    channelList: {},
    channelDetail: {},
    deviceCompanyList: {},
    deviceList: {},
    deviceDetail: {},
    displayAndVoiceConfig: {},
    presenceRecordList: {},
    abnormalRecordList: {},
    liftRecordList: {},
  },

  effects: {
    /* 获取企业列表 */
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getParkCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'append',
          payload: {
            name: 'companyList',
            data,
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 获取车辆企业列表 */
    *getVehicleCompanyList(
      {
        payload,
        payload: { pageNum },
        callback,
      },
      { call, put, all }
    ) {
      if (pageNum === 1) {
        const responseList = yield all([
          call(getVehicleCompanyList, payload),
          call(getCompanyVehicleCount, payload),
        ]);
        const [{ code: c1, data: d1 } = {}, { code: c2, data: d2 } = {}] = responseList || [];
        if (c1 === 200 && d1 && d1.list && c2 === 200 && d2 >= 0) {
          const data = {
            ...d1,
            pagination: {
              ...d1.pagination,
              a: d2,
            },
          };
          yield put({
            type: 'append',
            payload: {
              name: 'vehicleCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        }
      } else {
        const response = yield call(getVehicleCompanyList, payload);
        const { code, data, msg } = response || {};
        if (code === 200 && data && data.list) {
          yield put({
            type: 'append',
            payload: {
              name: 'vehicleCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        } else {
          callback && callback(false, msg);
        }
      }
    },
    /* 获取车辆列表 */
    *getVehicleList({ payload, callback }, { call, put }) {
      const response = yield call(getVehicleList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'append',
          payload: {
            name: 'vehicleList',
            data,
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 刷新车辆列表 */
    *reloadVehicleList(
      {
        payload,
        payload: { pageNum, pageSize },
        callback,
      },
      { call, put }
    ) {
      const response = yield call(getVehicleList, {
        ...payload,
        pageNum: 1,
        pageSize: pageNum * pageSize,
      });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            vehicleList: {
              ...data,
              pagination: {
                ...data.pagination,
                pageNum,
                pageSize,
              },
            },
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取车辆详情
    *getVehicleDetail({ payload, callback }, { call, put }) {
      const response = yield call(getVehicleDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const vehicleDetail = {
          ...data,
          // 车辆照片: (data.车辆照片 || []).map((item, index) => ({
          //   ...item,
          //   status: 'done',
          //   uid: -1 - index,
          //   name: item.fileName,
          //   url: item.webUrl,
          // })),
        };
        yield put({
          type: 'save',
          payload: {
            vehicleDetail,
          },
        });
        callback && callback(true, vehicleDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除车辆
    *deleteVehicle({ payload, callback }, { call, put }) {
      const response = yield call(deleteVehicle, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增车辆
    *addVehicle({ payload, callback }, { call, put }) {
      const response = yield call(addVehicle, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑车辆
    *editVehicle({ payload, callback }, { call, put }) {
      const response = yield call(editVehicle, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    /* 获取车场企业列表 */
    *getParkCompanyList(
      {
        payload,
        payload: { pageNum },
        callback,
      },
      { call, put, all }
    ) {
      if (pageNum === 1) {
        const responseList = yield all([
          call(getParkCompanyList, payload),
          call(getCompanyParkCount, payload),
        ]);
        const [{ code: c1, data: d1 } = {}, { code: c2, data: d2 } = {}] = responseList || [];
        if (c1 === 200 && d1 && d1.list && c2 === 200 && d2 >= 0) {
          const data = {
            ...d1,
            pagination: {
              ...d1.pagination,
              a: d2,
            },
          };
          yield put({
            type: 'append',
            payload: {
              name: 'parkCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        }
      } else {
        const response = yield call(getParkCompanyList, payload);
        const { code, data, msg } = response || {};
        if (code === 200 && data && data.list) {
          yield put({
            type: 'append',
            payload: {
              name: 'parkCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        } else {
          callback && callback(false, msg);
        }
      }
    },
    /* 获取车场列表 */
    *getParkList({ payload, callback }, { call, put }) {
      const response = yield call(getParkList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const parkList = data;
        yield put({
          type: 'save',
          payload: {
            parkList,
          },
        });
        callback && callback(true, parkList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取车场详情
    *getParkDetail({ payload, callback }, { call, put }) {
      const response = yield call(getParkDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const parkDetail = data;
        yield put({
          type: 'save',
          payload: {
            parkDetail,
          },
        });
        callback && callback(true, parkDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除车场
    *deletePark({ payload, callback }, { call, put }) {
      const response = yield call(deletePark, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增车场
    *addPark({ payload, callback }, { call, put }) {
      const response = yield call(addPark, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑车场
    *editPark({ payload, callback }, { call, put }) {
      const response = yield call(editPark, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    /* 获取区域列表 */
    *getAreaList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const areaList = data;
        yield put({
          type: 'save',
          payload: {
            areaList,
          },
        });
        callback && callback(true, areaList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取区域详情
    *getAreaDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getAreaDetail, payload);
      console.log('getDetail');
      console.log(payload);
      const response = {
        code: 200,
        data: {
          id: 1,
          unitId: 'zcdm737ycau1i9ca',
          联系电话: '1',
          车场名称: '1',
          车场所在城市: '33148',
          车场所在省份: '5709',
          车场状态: '1',
          车场联系人: '1',
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const areaDetail = data;
        yield put({
          type: 'save',
          payload: {
            areaDetail,
          },
        });
        callback && callback(true, areaDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除区域
    *deleteArea({ payload, callback }, { call, put }) {
      // const response = yield call(deleteArea, payload);
      console.log('delete');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增区域
    *addArea({ payload, callback }, { call, put }) {
      // const response = yield call(addArea, payload);
      console.log('add');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑区域
    *editArea({ payload, callback }, { call, put }) {
      // const response = yield call(editArea, payload);
      console.log('edit');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    /* 获取通道企业列表 */
    *getChannelCompanyList(
      {
        payload,
        payload: { pageNum },
        callback,
      },
      { call, put, all }
    ) {
      if (pageNum === 1) {
        const responseList = yield all([
          call(getChannelCompanyList, payload),
          call(getCompanyChannelCount, payload),
        ]);
        const [{ code: c1, data: d1 } = {}, { code: c2, data: d2 } = {}] = responseList || [];
        if (c1 === 200 && d1 && d1.list && c2 === 200 && d2 >= 0) {
          const data = {
            ...d1,
            pagination: {
              ...d1.pagination,
              a: d2,
            },
          };
          yield put({
            type: 'append',
            payload: {
              name: 'channelCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        }
      } else {
        const response = yield call(getChannelCompanyList, payload);
        const { code, data, msg } = response || {};
        if (code === 200 && data && data.list) {
          yield put({
            type: 'append',
            payload: {
              name: 'channelCompanyList',
              data,
            },
          });
          callback && callback(true, data);
        } else {
          callback && callback(false, msg);
        }
      }
    },
    /* 获取通道列表 */
    *getChannelList({ payload, callback }, { call, put }) {
      const response = yield call(getChannelList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const channelList = data;
        yield put({
          type: 'save',
          payload: {
            channelList,
          },
        });
        callback && callback(true, channelList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取通道详情
    *getChannelDetail({ payload, callback }, { call, put }) {
      const response = yield call(getChannelDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const channelDetail = data;
        yield put({
          type: 'save',
          payload: {
            channelDetail,
          },
        });
        callback && callback(true, channelDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除通道
    *deleteChannel({ payload, callback }, { call, put }) {
      const response = yield call(deleteChannel, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增通道
    *addChannel({ payload, callback }, { call, put }) {
      const response = yield call(addChannel, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑通道
    *editChannel({ payload, callback }, { call, put }) {
      const response = yield call(editChannel, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    /* 获取设备列表 */
    *getDeviceList({ payload, callback }, { call, put }) {
      const response = yield call(getDeviceList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const deviceList = data;
        yield put({
          type: 'save',
          payload: {
            deviceList,
          },
        });
        callback && callback(true, deviceList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取设备详情
    *getDeviceDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDeviceDetail, payload);
      console.log('getDetail');
      console.log(payload);
      const response = {
        code: 200,
        data: {
          id: 1,
          unitId: 'zcdm737ycau1i9ca',
          联系电话: '1',
          车场名称: '1',
          车场所在城市: '33148',
          车场所在省份: '5709',
          车场状态: '1',
          车场联系人: '1',
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const deviceDetail = data;
        yield put({
          type: 'save',
          payload: {
            deviceDetail,
          },
        });
        callback && callback(true, deviceDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 删除设备
    *deleteDevice({ payload, callback }, { call, put }) {
      // const response = yield call(deleteDevice, payload);
      console.log('delete');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增设备
    *addDevice({ payload, callback }, { call, put }) {
      // const response = yield call(addDevice, payload);
      console.log('add');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑设备
    *editDevice({ payload, callback }, { call, put }) {
      // const response = yield call(editDevice, payload);
      console.log('edit');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 设置主相机
    *setMainCamera({ payload, callback }, { call, put }) {
      // const response = yield call(setMainCamera, payload);
      console.log('setMainCamera');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取显示与声音配置
    *getDisplayAndVoiceConfig({ payload, callback }, { call, put }) {
      // const response = yield call(getDisplayAndVoiceConfig, payload);
      console.log('getDisplayAndVoiceConfig');
      console.log(payload);
      const response = {
        code: 200,
        data: {
          id: 1,
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const displayAndVoiceConfig = data;
        yield put({
          type: 'save',
          payload: {
            displayAndVoiceConfig,
          },
        });
        callback && callback(true, displayAndVoiceConfig);
      } else {
        callback && callback(false, msg);
      }
    },
    // 应用显示与声音配置
    *setDisplayAndVoiceConfig({ payload, callback }, { call, put }) {
      // const response = yield call(setDisplayAndVoiceConfig, payload);
      console.log('setDisplayAndVoiceConfig');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取在场记录列表
    *getPresenceRecordList({ payload, callback }, { call, put }) {
      const response = yield call(getPresenceRecordList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'save',
          payload: {
            presenceRecordList: {
              ...data,
              list: data.list.map(item => ({
                ...item,
                inOutRecordList: item.inOutRecordList.reduce(
                  (arr, cur) => {
                    if (cur.recordType >= 0) {
                      arr[cur.recordType ^ 1] = cur;
                    }
                    return arr;
                  },
                  [{}, {}]
                ),
              })),
            },
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    // 导出在场记录
    *exportPresenceRecordList({ payload }, { call }) {
      const blob = yield call(exportPresenceRecordList, payload);
      fileDownload(blob, `在场记录_${moment().format('YYYYMMDD')}.xlsx`);
    },
    // 获取异常抬杆记录列表
    *getAbnormalRecordList({ payload, callback }, { call, put }) {
      const response = yield call(getAbnormalRecordList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const abnormalRecordList = data;
        yield put({
          type: 'save',
          payload: {
            abnormalRecordList,
          },
        });
        callback && callback(true, abnormalRecordList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 导出异常抬杆记录
    *exportAbnormalRecordList({ payload }, { call }) {
      const blob = yield call(exportAbnormalRecordList, payload);
      fileDownload(blob, `异常抬杆记录_${moment().format('YYYYMMDD')}.xlsx`);
    },
    // 获取抬杆记录
    *getLiftRecordList({ payload, callback }, { call, put }) {
      const response = yield call(getLiftRecordList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const liftRecordList = data;
        yield put({
          type: 'save',
          payload: {
            liftRecordList,
          },
        });
        callback && callback(true, liftRecordList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    append: (
      state,
      {
        payload: {
          name,
          data: {
            list,
            pagination,
            pagination: { pageNum },
          },
        },
      }
    ) => ({
      ...state,
      [name]: {
        list: pageNum === 1 ? list : state[name].list.concat(list),
        pagination: {
          ...state[name].pagination,
          ...pagination,
        },
      },
    }),
  },
};