import {
  getCompanyList,
  getList,
  getCount,
  getMap,
  getDetail,
  add,
  edit,
  remove,
  approve,
} from '@/services/workingBill';
import moment from 'moment';
import { isNumber } from '@/utils/utils';

export default {
  namespace: 'workingBill',

  state: {
    companyList: [],
    list: {},
    map: [],
    detail: {},
  },

  effects: {
    // 获取企业列表
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyList = data.list;
        yield put({
          type: 'save',
          payload: {
            companyList,
          },
        });
        callback && callback(true, companyList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取工作票列表
    *getList({ payload, callback }, { call, put, all }) {
      const responseList = yield all([
        call(getList, payload),
        call(getCount, { approveStatus: '1' }),
        call(getCount, { workingStatus: '2' }),
      ]);
      const [{ code, data, msg } = {}, { data: data1 } = {}, { data: data2 } = {}] =
        responseList || [];
      if (code === 200 && data && data.list) {
        const list = {
          ...data,
          approveCount:
            data1 && data1.list
              ? data1.list.reduce((result, { type, count }) => ({ ...result, [type]: count }), {})
              : {},
          workingCount:
            data2 && data2.list
              ? data2.list.reduce((result, { type, count }) => ({ ...result, [type]: count }), {})
              : {},
        };
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取地图数据
    *getMap({ payload, callback }, { call, put }) {
      const response = yield call(getMap, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const map = data.list[0] || {};
        yield put({
          type: 'save',
          payload: {
            map,
          },
        });
        callback && callback(true, map);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取作业票详情
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = {
          ...data,
          company:
            data.companyId && data.companyName
              ? { key: data.companyId, label: data.companyName }
              : undefined,
          billType: data.billType ? `${data.billType}` : undefined,
          applyUserId: data.applyUserId ? `${data.applyUserId}` : undefined,
          applyCompanyName: data.applyCompanyName || undefined,
          applyDepartmentId: data.applyDepartmentId ? `${data.applyDepartmentId}` : undefined,
          applyDate: data.applyDate ? moment(data.applyDate) : undefined,
          billCode: data.billCode || undefined,
          billLevel: data.billLevel ? `${data.billLevel}` : undefined,
          supervisor: data.supervisor || undefined,
          supervisorPosition: data.supervisorPosition || undefined,
          manager: data.manager || undefined,
          range:
            data.workingStartDate && data.workingEndDate
              ? [moment(data.workingStartDate), moment(data.workingEndDate)]
              : undefined,
          workingContent: data.workingContent || undefined,
          workingWay: data.workingWay || undefined,
          workingProject: data.workingProject || undefined,
          workingCompanyType: data.workingCompanyType ? `${data.workingCompanyType}` : undefined,
          workingCompanyName: data.workingCompanyName || undefined,
          workingManager: data.workingManager || undefined,
          workingPersonnel: data.workingPersonnel ? data.workingPersonnel.split(',') : undefined,
          safetyEducator: data.safetyEducator || undefined,
          constructionManager: data.constructionManager || undefined,
          planType: isNumber(data.planType) ? `${data.planType}` : undefined,
          workingStatus: data.workingStatus ? `${data.workingStatus}` : undefined,
          finishDate: data.finishDate ? moment(data.finishDate) : undefined,
          riskFactors: data.riskFactors || undefined,
          safetyMeasures: JSON.parse(data.safetyMeasures) || undefined,
          certificatesFileList: data.certificatesFileList
            ? data.certificatesFileList.map((item, index) => ({
                ...item,
                url: item.webUrl,
                status: 'done',
                uid: -index - 1,
                name: item.fileName,
              }))
            : [],
          applyFileList: data.applyFileList
            ? data.applyFileList.map((item, index) => ({
                ...item,
                url: item.webUrl,
                status: 'done',
                uid: -index - 1,
                name: item.fileName,
              }))
            : [],
          locationFileList: data.locationFileList
            ? data.locationFileList.map((item, index) => ({
                ...item,
                url: item.webUrl,
                status: 'done',
                uid: -index - 1,
                name: item.fileName,
              }))
            : [],
          approveStatus: data.approveStatus ? `${data.approveStatus}` : undefined,
          workingDepartment: data.workingDepartment ? `${data.workingDepartment}` : undefined,
          agent: data.agent || undefined,
          height: data.height || undefined,
          address: data.address || undefined,
          compilingPerson: data.compilingPerson || undefined,
          hazardIdentification: data.hazardIdentification || undefined,
          equipmentPipelineName: data.equipmentPipelineName || undefined,
          mainMedium: data.mainMedium || undefined,
          temperature: data.temperature || undefined,
          pressure: data.pressure || undefined,
          material: data.material || undefined,
          specs: data.specs || undefined,
          location: data.location || undefined,
          blindPlateCode: data.blindPlateCode || undefined,
          recoveryDate: data.recoveryDate ? moment(data.recoveryDate) : undefined,
          powerAccessPoint: data.powerAccessPoint || undefined,
          voltage: data.voltage || undefined,
          mapAddress: data.mapAddress ? JSON.parse(data.mapAddress) : undefined,
          isCrossWarn: !!data.crossWarn,
          isStaticWarn: !!data.staticWarn,
          isStrandedWarn: !!data.strandedWarn,
          crossWarn: data.crossWarn ? data.crossWarn.split(',') : undefined,
          workingCompany: data.workingCompanyId
            ? {
                key: data.workingCompanyId,
                value: data.workingCompanyId,
                label: data.workingCompanyLabel,
              }
            : undefined,
          workingPersonnelId: data.workingPersonnelId
            ? data.workingPersonnelId.split(',').map((item, index) => ({
                key: item,
                value: item,
                label: data.workingPersonnelName[index],
              }))
            : undefined,
        };

        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 新增
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 审批
    *approve({ payload, callback }, { call, put }) {
      const response = yield call(approve, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 重新申请
    *reapply({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
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
  },
};
