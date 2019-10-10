import {
  queryPersonCompanyList, // 获取人员信息企业列表
  queryPersonInfoList, // 人员基本信息列表
  queryPersonInfoAdd, // 新增人员基本信息
  queryPersonInfoEdit, // 编辑人员基本信息
  queryPersonInfoDelete, // 删除人员基本信息
  queryVehicleCompanyList, // 获取车辆信息企业列表
  queryVehicleInfoList, // 车辆基本信息列表
  queryVehicleInfoAdd, // 新增车辆基本信息
  queryVehicleInfoEdit, // 编辑车辆基本信息
  queryVehicleInfoDelete, // 删除车辆基本信息
} from '../services/personnelInfo.js';

export default {
  namespace: 'personnelInfo',

  state: {
    loading: false,
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    isLast: false,
    pageNum: 1,
    personnelTypeList: [
      {
        key: '1',
        value: '员工',
      },
      {
        key: '2',
        value: '外协人员',
      },
      {
        key: '3',
        value: '临时人员',
      },
    ],
    sexTypeList: [
      {
        key: '1',
        value: '男',
      },
      {
        key: '2',
        value: '女',
      },
    ],
    vehicleType: [
      {
        key: '1',
        value: '正常',
      },
      {
        key: '2',
        value: '停用',
      },
    ],
    // 人员企业列表数据
    personnelData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加人员企业
    personnelDetail: {
      data: {},
    },
    // 人员信息列表数据
    personnelInfoData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加、编辑人员信息
    personnelInfoDetail: {
      data: {},
    },
    // 车辆企业列表数据
    vehicleData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加车辆企业
    vehicleDetail: {
      data: {},
    },
    // 车辆信息列表数据
    vehicleInfoData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加、编辑车辆信息
    vehicleInfoDetail: {
      data: {},
    },
  },

  effects: {
    // 获取人员信息企业列表
    *fetchPersonCompanyList({ payload }, { call, put }) {
      const response = yield call(queryPersonCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePersonCompanyList', payload: data });
      }
    },

    // 追加企业列表
    *appendPersonCompanyList({ payload, success, error }, { call, put }) {
      const response = yield call(queryPersonCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePersonCompanyListMore',
          payload: data,
        });
      }
    },

    // 人员基本信息列表
    *fetchPersonInfoList({ payload, callback }, { call, put }) {
      const response = yield call(queryPersonInfoList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePersonInfoList', payload: data });
        if (callback) callback(data);
      }
    },

    // 追加人员信息列表
    *appendPersonInfoList({ payload }, { call, put }) {
      const response = yield call(queryPersonInfoList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePersonInfoListMore',
          payload: data,
        });
      }
    },

    // 新增人员基本信息
    *fetchPersonInfoAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryPersonInfoAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePersonInfoAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 编辑人员基本信息
    *fetchPersonInfoEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryPersonInfoEdit, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePersonInfoEdit',
          payload: data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 删除人员基本信息
    *fetchPersonInfoDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryPersonInfoDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'savePersonInfoDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 获取车辆信息企业列表
    *fetchVehicleCompanyList({ payload }, { call, put }) {
      const response = yield call(queryVehicleCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveVehicleCompanyList', payload: data });
      }
    },

    // 追加车辆企业列表
    *appendVehicleCompanyList({ payload }, { call, put }) {
      const response = yield call(queryVehicleCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveVehicleCompanyListMore',
          payload: data,
        });
      }
    },

    // 车辆基本信息列表
    *fetchVehicleInfoList({ payload, callback }, { call, put }) {
      const response = yield call(queryVehicleInfoList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveVehicleInfoList', payload: data });
        if (callback) callback(data);
      }
    },

    // 追加车辆信息列表
    *appendVehicleInfoList({ payload }, { call, put }) {
      const response = yield call(queryVehicleInfoList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveVehicleInfoListMore',
          payload: data,
        });
      }
    },

    // 新增车辆基本信息
    *fetchVehiclefoAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryVehicleInfoAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveVehicleInfoAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 编辑车辆基本信息
    *fetchVehicleInfoEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryVehicleInfoEdit, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveVehicleInfoEdit',
          payload: data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 删除车辆基本信息
    *fetchVehicleInfoDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryVehicleInfoDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveVehicleInfoDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
  },

  reducers: {
    // 获取人员企业列表
    savePersonCompanyList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        personnelData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载人员企业列表
    savePersonCompanyListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        personnelData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 人员信息列表
    savePersonInfoList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        personnelInfoData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载人员信息列表
    savePersonInfoListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        personnelInfoData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 新增人员信息
    savePersonInfoAdd(state, { payload }) {
      return {
        ...state,
        personnelInfoDetail: payload,
      };
    },

    // 编辑人员信息
    savePersonInfoEdit(state, { payload }) {
      return {
        ...state,
        personnelInfoDetail: {
          ...state.personnelInfoDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearPersonnelDetail(state) {
      return {
        ...state,
        personnelInfoDetail: { data: {} },
      };
    },

    // 删除人员信息
    savePersonInfoDelete(state, { payload: id }) {
      return {
        ...state,
        personnelInfoData: {
          ...state.personnelInfoData,
          list: state.personnelInfoData.list.filter(item => item.id !== id),
        },
      };
    },

    // 获取车辆企业列表
    saveVehicleCompanyList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        vehicleData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载车辆企业列表
    saveVehicleCompanyListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        vehicleData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 车辆信息列表
    saveVehicleInfoList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        vehicleInfoData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载车辆信息列表
    saveVehicleInfoListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        vehicleInfoData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 新增车辆信息
    saveVehicleInfoAdd(state, { payload }) {
      return {
        ...state,
        vehicleInfoDetail: payload,
      };
    },

    // 编辑车辆信息
    saveVehicleInfoEdit(state, { payload }) {
      return {
        ...state,
        vehicleInfoDetail: {
          ...state.vehicleInfoDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearVehicleDetail(state) {
      return {
        ...state,
        vehicleInfoDetail: { data: {} },
      };
    },

    // 删除车辆信息
    saveVehicleInfoDelete(state, { payload: id }) {
      return {
        ...state,
        vehicleInfoData: {
          ...state.vehicleInfoData,
          list: state.personnelInfoData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
