import {
  addMonitoringScene, // 添加监测场景
  queryMonitorSceneList, // 监测企业列表
  queryFaceList, // 人脸列表
  addFaceInfo, // 添加人脸
  queryFaceExport, // 导入人脸
  editFaceInfo, // 修改人脸信息
  deleteFaceInfo, // 删除人脸信息
  queryMonitorDotList, // 监测点列表
  addMonitorDotInfo, // 添加监测点
  editMonitorDotInfo, // 修改监测点
  deleteMonitorDot, // 删除监测点
  queryFaceCameraList, // 人脸摄像机列表
  addFaceCameraInfo, // 添加摄像机
  editFaceCameraInfo, // 修改摄像机
  deleteCameraInfo, // 删除摄像机
  queryAlarmRecord, // 报警历史记录
} from '../services/securityManage.js';

export default {
  namespace: 'securityManage',

  state: {
    data: {
      list: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
    },
    isLast: false,
    pageNum: 1,
    sexList: [
      {
        key: '0',
        value: '全部',
      },
      {
        key: '1',
        value: '男',
      },
      {
        key: '2',
        value: '女',
      },
    ],
    documentTypeList: [
      {
        key: '0',
        value: '全部',
      },
      {
        key: '1',
        value: '军官证',
      },
      {
        key: '2',
        value: '身份证',
      },
    ],
    // 监测场景数据
    monitorSceneDetail: {
      data: {},
    },
    // 人脸列表数据
    faceData: {
      list: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
    },
    // 新增编辑人脸数据
    FaceDetail: {
      data: {},
    },
    momitorPointModal: {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
    },
    // 人脸库照片导入数据
    faceExportData: {},

    // 监测点列表数据
    monitorDotData: {
      list: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
    },
    monitorDotDetail: {
      data: {},
    },

    // 人脸摄像机数据
    faceCameraData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
      pageSize: 10,
      pageNum: 1,
    },
    faceCameraDetail: {
      data: {},
    },
    // 报警历史记录数据
    AlarmData: {
      list: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
    },
  },

  effects: {
    // 添加监测场景
    *fetchMonitorSceneAdd({ payload, success, error }, { call, put }) {
      const response = yield call(addMonitoringScene, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveMonitorSceneAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 企业列表
    *fetchMonitorCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(queryMonitorSceneList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveMonitorSceneList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 追加企业列表
    *appendCompanyList({ payload }, { call, put }) {
      const response = yield call(queryMonitorSceneList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveMonitorCompanyList',
          payload: data,
        });
      }
    },

    // 人脸列表
    *fetchFaceList({ payload, callback }, { call, put }) {
      const response = yield call(queryFaceList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveFaceList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 加载人脸列表
    *fetchFaceListMore({ payload, callback }, { call, put }) {
      const response = yield call(queryFaceList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveFaceListMore',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 添加人脸
    *fetcFaceAdd({ payload, success, error }, { call, put }) {
      const response = yield call(addFaceInfo, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveFaceAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 导入人脸
    *fetchFaceExport({ payload, success, error }, { call }) {
      const response = yield call(queryFaceExport, payload);
      if (response.code === 200) {
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑人脸信息
    *fetchFaceEdit({ payload, success, error }, { call, put }) {
      const response = yield call(editFaceInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFaceUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除人脸信息
    *fetchFaceDelete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteFaceInfo, payload);
      if (response.code === 200) {
        yield put({ type: 'removeFace', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 监测点列表
    *fetchMonitorDotList({ payload, callback }, { call, put }) {
      const response = yield call(queryMonitorDotList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveMonitorDotList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 加载人脸摄像机列表
    *fetchMonitorDotListMore({ payload, callback }, { call, put }) {
      const response = yield call(queryMonitorDotList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveMonitorDotListMore',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 添加监测点
    *fetcMonitorDotAdd({ payload, success, error }, { call, put }) {
      const response = yield call(addMonitorDotInfo, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveMonitorDotAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 编辑监测点信息
    *fetchMonitorDotEdit({ payload, success, error }, { call, put }) {
      const response = yield call(editMonitorDotInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMonitorDotUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除监测点
    *fetchMonitorDotDelete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteMonitorDot, payload);
      if (response.code === 200) {
        yield put({ type: 'removeMonitorDot', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 人脸摄像机列表
    *fetchFaceCameraList({ payload, callback }, { call, put }) {
      const response = yield call(queryFaceCameraList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveFaceCameraList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 加载人脸摄像机列表
    *fetchFaceCameraListMore({ payload, callback }, { call, put }) {
      const response = yield call(queryFaceCameraList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveFaceCameraListMore',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 添加摄像机
    *fetcFaceCameraAdd({ payload, success, error }, { call, put }) {
      const response = yield call(addFaceCameraInfo, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveFaceCameraAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 编辑摄像机
    *fetchFaceCameraEdit({ payload, success, error }, { call, put }) {
      const response = yield call(editFaceCameraInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFaceCameraUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除摄像机
    *fetchCameraDelete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteCameraInfo, payload);
      if (response.code === 200) {
        yield put({ type: 'removeCamera', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 报警历史列表
    *fetchAlarmRecordList({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmRecord, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveAlarmRecordList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 加载报警历史列表
    *fetchAlarmRecordMore({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmRecord, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveAlarmRecordMore',
          payload: data,
        });
        if (callback) callback(data);
      }
    },
  },

  reducers: {
    // 添加监测场景
    saveMonitorSceneAdd(state, { payload }) {
      return {
        ...state,
        monitorSceneDetail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 获取企业列表
    saveMonitorSceneList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 获取更多企业列表
    saveMonitorCompanyList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        data: {
          list: nextList,
          pageNum,
          pageSize,
          total,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 人脸列表
    saveFaceList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        faceData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载人脸列表
    saveFaceListMore(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        faceData: {
          list: nextList,
          pageNum,
          pageSize,
          total,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 添加人脸
    saveFaceAdd(state, { payload }) {
      return {
        ...state,
        FaceDetail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 导入人脸
    saveFaceExport(state, { payload }) {
      return {
        ...state,
        faceExportData: {
          ...state.faceExportData,
          data: payload,
        },
      };
    },

    // 编辑人脸信息
    saveFaceUpdate(state, { payload }) {
      return {
        ...state,
        FaceDetail: {
          ...state.FaceDetail,
          data: payload,
        },
      };
    },

    // 删除人脸信息
    removeFace(state, { payload: id }) {
      return {
        ...state,
        faceData: {
          ...state.faceData,
          list: state.faceData.list.filter(item => item.id !== id),
        },
      };
    },

    // 获取监测点列表
    saveMonitorDotList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        monitorDotData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载监测点列表
    saveMonitorDotListMore(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        monitorDotData: {
          list: nextList,
          pageNum,
          pageSize,
          total,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 添加监测点
    saveMonitorDotAdd(state, { payload }) {
      return {
        ...state,
        monitorDotDetail: {
          ...state.monitorDotDetail,
          data: payload,
        },
      };
    },

    // 清除监测点详情
    clearMonitorDotDetail(state) {
      return {
        ...state,
        monitorDotDetail: { data: {} },
      };
    },

    // 修改监测点
    saveMonitorDotUpdate(state, { payload }) {
      return {
        ...state,
        monitorDotDetail: {
          ...state.monitorDotDetail,
          data: payload,
        },
      };
    },

    // 删除监测点
    removeMonitorDot(state, { payload: id }) {
      return {
        ...state,
        monitorDotData: {
          ...state.monitorDotData,
          list: state.monitorDotData.list.filter(item => item.id !== id),
        },
      };
    },

    // 获取人脸摄像机列表
    saveFaceCameraList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      const pagination = { pageNum, pageSize, total };
      return {
        ...state,
        list,
        pageNum: 1,
        faceCameraData: { pagination, ...payload },
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载更多摄像机列表
    saveFaceCameraListMore(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        faceCameraData: {
          list: nextList,
          pageNum,
          pageSize,
          total,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 删除摄像机
    removeCamera(state, { payload: id }) {
      return {
        ...state,
        faceCameraData: {
          ...state.faceCameraData,
          list: state.faceCameraData.list.filter(item => item.id !== id),
        },
      };
    },

    // 添加摄像机
    saveFaceCameraAdd(state, { payload }) {
      return {
        ...state,
        faceCameraDetail: {
          ...state.faceCameraDetail,
          data: payload,
        },
      };
    },

    // 修改摄像机
    saveFaceCameraUpdate(state, { payload }) {
      return {
        ...state,
        faceCameraDetail: {
          ...state.faceCameraDetail,
          data: payload,
        },
      };
    },

    // 报警历史列表
    saveAlarmRecordList(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        AlarmData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载报警历史列表
    saveAlarmRecordMore(state, { payload }) {
      const { list, pageNum, pageSize, total } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        AlarmData: {
          list: nextList,
          pageNum,
          pageSize,
          total,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },
  },
};
