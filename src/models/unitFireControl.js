import {
  // 获取待处理信息
  getPendingInfo,
  // 获取待处理火警和待处理故障数量
  getPendingNumber,
  // 超期未整改隐患数量
  getOutOfDateNumber,
  // 获取待整改隐患数量
  getToBeRectifiedNumber,
  // 获取待巡查任务数量
  getToBeInspectedNumber,
  // 获取火灾报警系统
  getFireAlarmSystem,
  // 获取隐患巡查记录
  getHiddenDangerRecords,
  // 获取消防数据统计
  getFireControlCount,
  // 获取隐患巡查统计
  getHiddenDangerCount,
  // 获取维保情况统计
  getMaintenanceCount,
  // 获取复位主机
  getHosts,
  // 复位单个主机
  resetSingleHost,
  // 复位所有主机
  resetAllHosts,
  // 获取视频列表
  getVideoList,
  // 获取已处理信息列表
  fetchUnPendingInfo,
  fetchPendingInfo,
  fetchInspectionStatistics,
  fetchDangerStatistics,
  fetchHiddenDangerRecords,
  // 获取消防主机列表
  fetchFireHosts,
  // 获取巡查统计-正常
  fetchNormalPatrol,
  // 获取巡查统计-异常
  fetchAbnormalPatrol,
  fetchPatrolDangers,
} from '../services/bigPlatform/fireControl';

const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
const getPendingInfoType = ({
  report_type = null,
  fire_state = null,
  fault_state = null,
  main_elec_state = null,
  prepare_elec_state = null,
  start_state = null,
  supervise_state = null,
  shield_state = null,
  feedback_state = null,
}, returnType = 'title') => {
  let value = '';
  if (+report_type === 2) {
    value = (returnType === 'title' && '一键报修') || (returnType === 'icon' && `${prefix}blue-baoxiu.png`);
  } else if (+fire_state === 1) {
    value = (returnType === 'title' && '火警') || (returnType === 'icon' && `${prefix}huojing.png`);
  } else if (+fault_state === 1 || +main_elec_state === 1 || +prepare_elec_state === 1) {
    value = (returnType === 'title' && '故障') || (returnType === 'icon' && `${prefix}blue-guzhang.png`);
  } else if (+start_state === 1) {
    value = (returnType === 'title' && '联动') || (returnType === 'icon' && `${prefix}blue-liandong.png`);
  } else if (+supervise_state === 1) {
    value = (returnType === 'title' && '监管') || (returnType === 'icon' && `${prefix}blue-jianguan.png`);
  } else if (+shield_state === 1) {
    value = (returnType === 'title' && '屏蔽') || (returnType === 'icon' && `${prefix}blue-pingbi.png`);
  } else if (+feedback_state === 1) {
    value = (returnType === 'title' && '反馈') || (returnType === 'icon' && `${prefix}blue-fankui.png`);
  }
  return value;
};

// 处理待办事项数组，处理隐患状态logo+排序
const generateListWithImg = list => {
  if (!list || list.length < 1) return []
  let fire = []
  let other = []
  list.forEach((item) => {
    const newItem = {
      ...item,
      pendingInfoType: item.pendingInfoType || getPendingInfoType(item, 'title'),
      icon: item.icon || getPendingInfoType(item, 'icon'),
    };
    // 如果是火警
    if (item.fire_state && +item.fire_state === 1) {
      fire.push(newItem)
    } else {
      other.push(newItem)
    }
  })
  return [...fire, ...other]
}


export default {
  namespace: 'unitFireControl',

  state: {
    // 待处理信息
    pendingInfo: {
      alarmTypes: [],
      isLast: false,
      pagination: { pageNum: 1, pageSize: 20, total: 0 },
      list: [],
    },
    // 历史信息
    informationHistory: {
      alarmTypes: [],
      isLast: false,
      pagination: { pageNum: 1, pageSize: 20, total: 0 },
      list: [],
    },
    // 巡查统计
    inspectionStatistics: {
      normal: 0, //正常数量
      abnormal: 0, //异常数量
      personNum: 0, //巡查人员个数
      totalCheckNum: 0, //巡查总次数
      list: [],         // 数据下钻列表（巡查记录）
      pagination: {      // 数据下钻分页信息
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isLast: false,
      dangers: [],        // 隐患列表
    },
    // 隐患统计
    dangerStatistics: {},
    // 待处理火警数量
    pendingFireNumber: 0,
    // 待处理故障数量
    pendingFaultNumber: 0,
    // 超期未整改隐患数量
    outOfDateNumber: 0,
    // 待整改隐患数量
    toBeRectifiedNumber: 0,
    // 待巡查任务数量
    toBeInspectedNumber: 0,
    // 火灾报警系统
    fireAlarmSystem: {
      fire_state: 0,
      fault_state: 0,
      start_state: 0,
      supervise_state: 0,
      shield_state: 0,
      feedback_state: 0,
    },
    // 隐患巡查记录
    hiddenDangerRecords: [],
    // 消防数据统计
    fireControlCount: {
      "faultAssign": 0,
      "shield_state": 0,
      "warn": 0,
      "warnTrue": 0,
      "start_state": 0,
      "fault_state": 0,
      "warnFalse": 0,
      "fault": 0,
      "feedback_state": 0,
      "faultSelf": 0,
      "fire_state": 0,
      "supervise_state": 0,
    },
    // 隐患巡查统计
    hiddenDangerCount: {

    },
    // 维保情况统计
    maintenanceCount: {
      "needRepairNum": 0,
      "selfNoNum": 0,
      "selfDoingNum": 0,
      "selfFinishNum": 0,
      "assignNoNum": 0,
      "assignDoingNum": 0,
      "assignFinishNum": 0,
      "avgSelfTime": "",
      "selfAllNum": 0,
      "selfRate": "100%",
      "avgAssignTime": "",
      "assignAllNum": 0,
      "assignRate": "100%",
    },
    // 复位主机列表
    hosts: [],
    // 视频列表
    videoList: [],
    fireHost: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    // 获取待处理信息
    /* *fetchPendingInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getPendingInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePendingInfo',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      }
      else if (error) {
        error();
      }
    }, */
    // 获取待处理信息(无status)和处理中信息（status传入'2'）
    *fetchPendingInfo({ payload, payload: { status } = {}, callback }, { call, put }) {
      const response = status && status === '2' ? yield call(fetchPendingInfo, payload) : yield call(fetchUnPendingInfo, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'savePendingInfo',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取已处理的信息 status传入'1'
    *fetchInformationHistory({ payload, payload: { status } = {}, callback }, { call, put }) {
      const response = yield call(fetchPendingInfo, payload)
      if (response && response.code === 200) {
        // 保存已处理
        yield put({
          type: 'saveHistoryInfo',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取待处理火警和待处理故障数量
    *fetchPendingNumber({ payload, success, error }, { call, put }) {
      const response = yield call(getPendingNumber, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePendingNumber',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    // 超期未整改隐患数量
    *fetchOutOfDateNumber({ payload, success }, { call, put }) {
      const response = yield call(getOutOfDateNumber, payload);
      yield put({
        type: 'saveOutOfDateNumber',
        payload: response.data.pagination.total,
      });
      if (success) {
        success(response.data.pagination.total);
      }
    },
    // 获取待整改隐患数量
    *fetchToBeRectifiedNumber({ payload, success }, { call, put }) {
      const response = yield call(getToBeRectifiedNumber, payload);
      yield put({
        type: 'saveToBeRectifiedNumber',
        payload: response.data.pagination.total,
      });
      if (success) {
        success(response.data.pagination.total);
      }
    },
    // 获取待巡查任务数量
    *fetchToBeInspectedNumber({ payload, success }, { call, put }) {
      const response = yield call(getToBeInspectedNumber, payload);
      yield put({
        type: 'saveToBeInspectedNumber',
        payload: response.total,
      });
      if (success) {
        success(response.total);
      }
    },
    // 获取火灾报警系统
    *fetchFireAlarmSystem({ payload, success, error }, { call, put }) {
      const response = yield call(getFireAlarmSystem, payload);
      if (response.code === 200) {
        const payload = response.data.list[0] || {
          fire_state: 0,
          fault_state: 0,
          start_state: 0,
          supervise_state: 0,
          shield_state: 0,
          feedback_state: 0,
        };
        yield put({
          type: 'saveFireAlarmSystem',
          payload,
        });
        if (success) {
          success(payload);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取隐患巡查记录
    *fetchHiddenDangerRecords({ payload, success }, { call, put }) {
      const response = yield call(fetchHiddenDangerRecords, payload);
      yield put({
        type: 'saveHiddenDangerRecords',
        payload: { list: response.data.rows, isYCQ: +payload._status === 7 },
      });
      if (success) {
        success(response.data.rows);
      }
    },
    // 获取消防数据统计
    *fetchFireControlCount({ payload, success, error }, { call, put }) {
      const response = yield call(getFireControlCount, payload);
      if (response.code === 200) {
        const payload = response.data.list[0] || {
          "faultAssign": 0,
          "shield_state": 0,
          "warn": 0,
          "warnTrue": 0,
          "start_state": 0,
          "fault_state": 0,
          "warnFalse": 0,
          "fault": 0,
          "feedback_state": 0,
          "faultSelf": 0,
          "fire_state": 0,
          "supervise_state": 0,
        };
        yield put({
          type: 'saveFireControlCount',
          payload,
        });
        if (success) {
          success(payload);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取隐患巡查统计
    *fetchHiddenDangerCount({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDangerCount, payload);
      yield put({
        type: 'saveHiddenDangerCount',
        payload: response,
      });
      if (success) {
        success(response);
      }
    },
    // 获取维保情况统计
    *fetchMaintenanceCount({ payload, success, error }, { call, put }) {
      const response = yield call(getMaintenanceCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMaintenanceCount',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取主机
    *fetchHosts({ payload, success, error }, { call, put }) {
      const response = yield call(getHosts, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveHosts',
          payload: response.data.list.filter(({ reset }) => +reset === 1).sort((a, b) => {
            return +b.isFire - a.isFire;
          }),
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    // 复位单个主机
    *changeSingleHost({ payload, success, error }, { call, put }) {
      const response = yield call(resetSingleHost, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateSingleHost',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    // 复位所有主机
    *changeAllHosts({ payload, success, error }, { call, put }) {
      const response = yield call(resetAllHosts, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateAllHosts',
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取视频列表
    *fetchVideoList({ payload, success, error }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({
        type: 'saveVideoList',
        payload: response.list,
      });
      if (success) {
        success();
      }
    },
    // 获取巡查统计数据
    *fetchInspectionStatistics({ payload, callback }, { call, put }) {
      const response = yield call(fetchInspectionStatistics, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveInspectionStatistics',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取隐患统计
    *fetchDangerStatistics({ payload, callback }, { call, put }) {
      const response = yield call(fetchDangerStatistics, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveDangerStatistics',
          payload: response.data,
        })
      }
    },
    // 获取消防主机列表
    *fetchFireHosts({ payload, callback }, { call, put }) {
      const response = yield call(fetchFireHosts, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveFireHosts',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取巡查统计-正常
    *fetchNormalPatrol({ payload, callback }, { call, put }) {
      const response = yield call(fetchNormalPatrol, payload)
      if (response && response.code === 200) {
        const { pageNum, pageSize } = payload
        yield put({
          type: 'savePatrolRecords',
          payload: {
            list: response.data.list,
            pagination: {
              pageNum,
              pageSize,
              total: response.data.total,
            },
          },
        })
        if (callback) callback(response.data.list)
      }
    },
    // 获取巡查统计-异常
    *fetchAbnormalPatrol({ payload, callback }, { call, put }) {
      const response = yield call(fetchAbnormalPatrol, payload)
      if (response && response.code === 200) {
        const { pageNum, pageSize } = payload
        yield put({
          type: 'savePatrolRecords',
          payload: {
            list: response.data.list,
            pagination: {
              pageNum,
              pageSize,
              total: response.data.total,
            },
          },
        })
        if (callback) callback(response.data.list)
      }
    },
    // 根据巡查记录获取隐患列表
    *fetchPatrolDangers({ payload, callback }, { call, put }) {
      const response = yield call(fetchPatrolDangers, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'savePatrolDangers',
          payload: response.data.list,
        })
        if (callback) callback()
      }
    },
  },

  reducers: {
    // 待处理信息
    savePendingInfo(state, { payload: { list = [], pageNum, pageSize, total } }) {
      const newList = generateListWithImg(list)
      if (+pageNum === 1) {
        return {
          ...state,
          pendingInfo: {
            ...state.pendingInfo,
            list: newList,
            isLast: pageNum * pageSize >= total,
            pagination: { pageNum, pageSize, total },
          },
        }
      } else {
        // 加载更多数据
        return {
          ...state,
          pendingInfo: {
            ...state.pendingInfo,
            list: [...state.pendingInfo.list, ...newList],
            isLast: pageNum * pageSize >= total,
            pagination: { pageNum, pageSize, total },
          },
        }
      }
    },
    // 保存历史信息
    saveHistoryInfo(state, { payload: { list = [], pageNum, pageSize, total } }) {
      const more = list.map(item => ({
        ...item,
        pendingInfoType: item.pendingInfoType || getPendingInfoType(item, 'title'),
        icon: item.icon || getPendingInfoType(item, 'icon'),
      }))
      if (+pageNum === 1) {
        return {
          ...state,
          informationHistory: {
            ...state.informationHistory,
            list: more,
            isLast: pageNum * pageSize >= total,
            pagination: { pageNum, pageSize, total },
          },
        }
      } else {
        // 加载更多数据
        return {
          ...state,
          informationHistory: {
            ...state.informationHistory,
            list: [...state.informationHistory.list, ...more],
            isLast: pageNum * pageSize >= total,
            pagination: { pageNum, pageSize, total },
          },
        }
      }
    },
    // 待处理火警数量和待处理故障数量
    savePendingNumber(state, { payload: { fire: pendingFireNumber, fault: pendingFaultNumber } }) {
      return {
        ...state,
        pendingFireNumber,
        pendingFaultNumber,
      };
    },
    // 超期未整改隐患数量
    saveOutOfDateNumber(state, { payload: outOfDateNumber }) {
      return {
        ...state,
        outOfDateNumber,
      };
    },
    // 待整改隐患数量
    saveToBeRectifiedNumber(state, { payload: toBeRectifiedNumber }) {
      return {
        ...state,
        toBeRectifiedNumber,
      };
    },
    // 待巡查任务数量
    saveToBeInspectedNumber(state, { payload: toBeInspectedNumber }) {
      return {
        ...state,
        toBeInspectedNumber,
      };
    },
    // 火灾报警系统
    saveFireAlarmSystem(state, { payload: fireAlarmSystem }) {
      return {
        ...state,
        fireAlarmSystem,
      };
    },
    // 隐患巡查记录
    saveHiddenDangerRecords(state, { payload: { list = [], isYCQ } }) {
      if (isYCQ) {
        const newList = list.sort((a, b) => a.plan_rectify_time - b.plan_rectify_time)
        return {
          ...state,
          hiddenDangerRecords: newList,
        };
      }
      return {
        ...state,
        hiddenDangerRecords: list,
      };
    },
    // 消防数据统计
    saveFireControlCount(state, { payload: fireControlCount }) {
      return {
        ...state,
        fireControlCount,
      };
    },
    // 隐患巡查统计
    saveHiddenDangerCount(state, { payload: hiddenDangerCount }) {
      return {
        ...state,
        hiddenDangerCount,
      };
    },
    // 维保情况统计
    saveMaintenanceCount(state, { payload: maintenanceCount }) {
      return {
        ...state,
        maintenanceCount,
      };
    },
    // 主机
    saveHosts(state, { payload: hosts }) {
      return {
        ...state,
        hosts,
      };
    },
    // 复位单个主机
    updateSingleHost(state, { payload }) {
      return {
        ...state,
        hosts: state.hosts.map(item => {
          if (item.id === payload) {
            return {
              ...item,
              isReset: true,
            };
          }
          return item;
        }),
      };
    },
    // 复位所有主机
    updateAllHosts(state) {
      return {
        ...state,
        hosts: state.hosts.map(item => {
          return {
            ...item,
            isReset: true,
          };
        }),
      };
    },
    // 视频列表
    saveVideoList(state, { payload: videoList }) {
      return {
        ...state,
        videoList,
      };
    },
    // 保存巡查统计
    saveInspectionStatistics(state, { payload: { normal, abnormal, personNum, totalCheckNum } }) {
      return {
        ...state,
        inspectionStatistics: {
          ...state.inspectionStatistics,
          normal, abnormal, personNum, totalCheckNum,
        },
      }
    },
    saveDangerStatistics(state, { payload }) {
      return {
        ...state,
        dangerStatistics: payload,
      }
    },
    saveFireHosts(state, { payload }) {
      const {
        list = [],
        pageNum = 1,
        pageSize = 10,
        total = 0,
      } = payload
      const newList = list && list.length > 0 ? list.map(item => ({
        ...item,
        typeName: getPendingInfoType(item),
        icon: getPendingInfoType(item, 'icon'),
      })) : []
      return {
        ...state,
        fireHost: {
          ...state.fireHost,
          list: newList,
          pagination: {
            pageNum,
            pageSize,
            total,
          },
        },
      }
    },
    // 保存巡查统计下钻列表
    savePatrolRecords(state, { payload: { list = [], pagination } }) {
      const { pageNum, pageSize, total } = pagination
      if (pageNum === 1) {
        return {
          ...state,
          inspectionStatistics: {
            ...state.inspectionStatistics,
            list,
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
      } else {
        return {
          ...state,
          inspectionStatistics: {
            ...state.inspectionStatistics,
            list: [...state.inspectionStatistics.list, ...list],
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
      }
    },
    savePatrolDangers(state, { payload }) {
      return {
        ...state,
        inspectionStatistics: {
          ...state.inspectionStatistics,
          dangers: payload,
        },
      }
    },
  },
}
