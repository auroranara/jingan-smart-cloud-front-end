import {
  getTaskList,
  getTaskCount,
  getFireCount,
  getUnitList,
} from '@/services/operation';
import { message } from 'antd';
function error(msg) {
  message.error(msg);
}

export default {
  namespace: 'operation',

  state: {
    // 任务列表
    taskList: [],
    // 运维任务统计
    count: {
      pending: 0, // 待处理
      processing: 0, // 处理中
      processed: 0, // 已处理
    },
    // 火警数量统计
    fireCount: {
      day: 0,
      week: 0,
      month: 0,
    },
    unitList: [],
  },

  effects: {
    *fetchTaskList({ payload }, { call, put }) {
      // const response = yield call(getTaskList, payload);
      const response = { code: 200, data: { list: [
        {
          id: 1,
          companyName: 'companyName', // 企业名称
          partType: 'partType', // 设施部件类型
          loopNumber: 'loopNumber', // 回路号
          partNumber: 'partNumber', // 故障号
          area: 'area', // 区域
          location: 'location', // 位置
          startTime: '1560411931642', // 报警/报修时间
          endTime: '1560411931642', // 结束时间
          status: '1', // 状态
          wordOrderNumber: 'wordOrderNumber', // 工单编号
          repairPersonName: 'repairPersonName', // 报修人员名称
          repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
        },{
          id: 2,
          companyName: 'companyName', // 企业名称
          partType: 'partType', // 设施部件类型
          loopNumber: 'loopNumber', // 回路号
          partNumber: 'partNumber', // 故障号
          area: 'area', // 区域
          location: 'location', // 位置
          startTime: '1560411931642', // 报警/报修时间
          endTime: '1560411931642', // 结束时间
          status: '2', // 状态
          wordOrderNumber: 'wordOrderNumber', // 工单编号
          repairPersonName: 'repairPersonName', // 报修人员名称
          repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
        },
      ] } };
      const { code=500, msg='获取任务失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const taskList = data && data.list ? data.list : [];
        yield put({
          type: 'save',
          payload: {
            taskList,
          },
        });
      } else {
        error(msg);
      }
    },
    *fetchTaskCount({ payload }, { call, put }) {
      // const response = yield call(getTaskCount, payload);
      const response = { code: 200, data: {
        pending: 10, // 待处理
        processing: 10, // 处理中
        processed: 10, // 已处理
      } };
      const { code=500, msg='获取运维任务统计失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { pending=0, processing=0, processed=0 } = data || {};
        yield put({
          type: 'save',
          payload: {
            taskCount: {
              pending,
              processing,
              processed,
            },
          },
        });
      } else {
        error(msg);
      }
    },
    *fetchFireCount({ payload }, { call, put }) {
      // const response = yield call(getFireCount, payload);
      const response = { code: 200, data: {
        day: 10, // 待处理
        month: 10, // 处理中
        week: 10, // 已处理
      } };
      const { code=500, msg='获取火警数量统计失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { day=0, month=0, week=0 } = data || {};
        yield put({
          type: 'save',
          payload: {
            fireCount: {
              day,
              month,
              week,
            },
          },
        });
      } else {
        error(msg);
      }
    },
    *fetchUnitList({ payload, callback }, { call, put }) {
      const response = yield call(getUnitList, payload);
      const { code, list } = response || {};
      if (code === 200) {
        const lst = Array.isArray(list) ? list : [];
        yield put({ type: 'saveUnitList', payload: lst });
        callback && callback(lst);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveUnitList(state, payload) {
      return { ...state, unitList: payload.action };
    },
  },
}
