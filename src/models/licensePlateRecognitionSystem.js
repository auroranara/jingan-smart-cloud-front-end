import {
  getCompanyList,
  getVehicleList,
  getVehicleDetail,
  addVehicle,
  deleteVehicle,
  editVehicle,
  getParkList,
  getParkDetail,
  addPark,
  deletePark,
  editPark,
  getAreaList,
} from '@/services/licensePlateRecognitionSystem';

export default {
  namespace: 'licensePlateRecognitionSystem',

  state: {
    companyList: {},
    vehicleList: {},
    vehicleDetail: {},
    parkList: {},
    parkDetail: {},
    provinceList: [],
    cityList: [],
  },

  effects: {
    /* 获取企业列表 */
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveCompanyList',
          payload: data,
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 获取省列表 */
    *getProvinceList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const provinceList = data.list.map(({ id, name }) => ({ key: `${id}`, value: name }));
        yield put({
          type: 'save',
          payload: {
            provinceList,
          },
        });
        callback && callback(true, provinceList);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 获取市列表 */
    *getCityList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const cityIds = +payload.cityIds;
        const cityList = data.list
          .find(({ id }) => id === cityIds)
          .children.map(({ id, name }) => ({ key: `${id}`, value: name }));
        yield put({
          type: 'save',
          payload: {
            cityList,
          },
        });
        callback && callback(true, cityList);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 获取车辆列表 */
    *getVehicleList({ payload, callback }, { call, put }) {
      const response = yield call(getVehicleList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveVehicleList',
          payload: data,
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    /* 刷新车辆列表 */
    *reloadVehicleList(
      {
        payload: { pageNum, pageSize, ...payload },
        callback,
      },
      { call, put }
    ) {
      const response = yield call(getVehicleList, {
        pageNum: 1,
        pageSize: pageNum * pageSize,
        ...payload,
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
      // const response = yield call(getVehicleDetail, payload);
      console.log('getDetail');
      console.log(payload);
      const response = {
        code: 200,
        data: {
          id: 1,
          品牌: '1',
          型号: '1',
          当前状态: '0',
          押运员: '1',
          押运员联系电话: '1',
          生产日期: +new Date(),
          购买日期: +new Date(),
          车牌号: '1',
          车牌类型: '0',
          车辆类型: '0',
          载重: 1,
          驾驶员: '1',
          驾驶员联系电话: '1',
          车辆照片: [
            {
              dbUrl: '@@IPEXP_IMP_FILES_WEB/gsafe/file/200206-195517-83a1.jpg',
              fileName: '车2.jpg',
              success: '/home/lucas/grid/webfiles_test/gsafe/file/200206-195517-83a1.jpg',
              webUrl: 'http://data.jingan-china.cn/hello/gsafe/file/200206-195517-83a1.jpg',
            },
          ],
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const vehicleDetail = {
          ...data,
          车辆照片: (data.车辆照片 || []).map((item, index) => ({
            ...item,
            status: 'done',
            uid: -1 - index,
            name: item.fileName,
            url: item.webUrl,
          })),
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
      // const response = yield call(deleteVehicle, payload);
      console.log('delete');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增车辆
    *addVehicle({ payload, callback }, { call, put }) {
      // const response = yield call(addVehicle, payload);
      console.log('add');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑车辆
    *editVehicle({ payload, callback }, { call, put }) {
      // const response = yield call(editVehicle, payload);
      console.log('edit');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
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
      // const response = yield call(getParkDetail, payload);
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
      // const response = yield call(deletePark, payload);
      console.log('delete');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 新增车场
    *addPark({ payload, callback }, { call, put }) {
      // const response = yield call(addPark, payload);
      console.log('add');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑车场
    *editPark({ payload, callback }, { call, put }) {
      // const response = yield call(editPark, payload);
      console.log('edit');
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveCompanyList: (
      state,
      {
        payload: {
          list,
          pagination,
          pagination: { pageNum },
        },
      }
    ) => ({
      ...state,
      companyList: {
        list: pageNum === 1 ? list : state.companyList.list.concat(list),
        pagination,
      },
    }),
    saveVehicleList: (
      state,
      {
        payload: {
          list,
          pagination,
          pagination: { pageNum },
        },
      }
    ) => ({
      ...state,
      vehicleList: {
        list: pageNum === 1 ? list : state.vehicleList.list.concat(list),
        pagination,
      },
    }),
  },
};
