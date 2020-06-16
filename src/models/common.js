import {
  getCompanyList,
  getCompanyDetail,
  getAreaList,
  getMonitorTypeList,
  getMonitorEquipmentList,
  setMonitorEquipmentBindStatus,
  getPersonList,
  getDepartmentList,
  getMapList,
  getContractorList,
  getSupplierList,
  getGridList,
  getGridListWithCount,
  getGridPersonList,
  getGridCompanyList,
  getGridCompanyListByUser,
  getExaminationContentList,
  getBusinessTypeList,
  getIndustryList,
  getFlowList,
  getSpecialRemediationSectionList,
  getSpecialRemediationSectionDetail,
  getSafetyServiceList,
  getSafetyServiceList2,
  getSafetyServiceListWithCount,
  getAccountList,
  getEmployeeList,
  getCheckedCompanyList,
  getGridTreeByUser,
  getPersonListByCompany,
  getDepartmentTreeByCompany,
  getPerformanceMeasurementStandardList,
} from '@/services/common';

export default {
  namespace: 'common',

  state: {
    companyList: {
      list: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    },
    companyDetail: {},
    areaList: [],
    monitorTypeList: [],
    monitorEquipmentList: {},
    personList: {},
    departmentList: [],
    staffList: [],
    unitList: [],
    mapList: [],
    contractorList: [],
    supplierList: [],
    gridList: [],
    gridListWithCount: [],
    gridPersonList: {},
    gridCompanyList: {},
    gridCompanyListByUser: {},
    examinationContentList: {},
    businessTypeList: [],
    industryList: [],
    flowList: {},
    specialRemediationSectionList: {},
    specialRemediationSectionDetail: {},
    safetyServiceList: {},
    safetyServiceList2: {},
    safetyServiceListWithCount: {},
    accountList: {},
    employeeList: {},
    checkedCompanyList: {},
    gridTreeByUser: [],
    personListByCompany: {},
    departmentTreeByCompany: [],
    // 绩效考核标准列表
    performanceMeasurementStandardList: {},
  },

  effects: {
    /* 获取列表 */
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const companyList = data || {};
        yield put({
          type: 'save',
          payload: {
            companyList,
          },
        });
        if (callback) {
          callback(companyList);
        }
      }
    },
    /* 获取列表 */
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
    // 获取企业详情
    *getCompanyDetail({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const companyDetail = data;
        yield put({
          type: 'save',
          payload: {
            companyDetail,
          },
        });
        callback && callback(true, companyDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取区域列表
    *getAreaList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const areaList = data.list;
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
    // 获取监测类型列表
    *getMonitorTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorTypeList = data.list.map(({ id, name }) => ({ key: id, value: name }));
        yield put({
          type: 'save',
          payload: {
            monitorTypeList,
          },
        });
        callback && callback(true, monitorTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测设备列表
    *getMonitorEquipmentList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorEquipmentList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorEquipmentList = data;
        yield put({
          type: 'save',
          payload: {
            monitorEquipmentList,
          },
        });
        callback && callback(true, monitorEquipmentList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 设置监测设备绑定状态
    *setMonitorEquipmentBindStatus({ payload, callback }, { call }) {
      const response = yield call(setMonitorEquipmentBindStatus, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取人员列表
    *getPersonList({ payload, callback }, { call, put }) {
      const response = yield call(getPersonList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const personList = data;
        yield put({
          type: 'save',
          payload: {
            personList,
          },
        });
        callback && callback(true, personList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取部门列表
    *getDepartmentList({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const departmentList = data.list;
        yield put({
          type: 'save',
          payload: {
            departmentList,
          },
        });
        callback && callback(true, departmentList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取企业列表
    *getUnitList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const unitList = data.list;
        yield put({
          type: 'save',
          payload: {
            unitList,
          },
        });
        callback && callback(true, unitList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取员工列表
    *getStaffList({ payload, callback }, { call, put }) {
      const response = yield call(getPersonList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const staffList = data.list;
        yield put({
          type: 'save',
          payload: {
            staffList,
          },
        });
        callback && callback(true, staffList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取地图列表
    *getMapList({ payload, callback }, { call, put }) {
      const response = yield call(getMapList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const mapList = data.list.map(item => ({
          ...item,
          tiltAngle: item.mapScaleLevelRangeList && item.mapScaleLevelRangeList[0],
          rotateAngle: item.mapScaleLevelRangeList && item.mapScaleLevelRangeList[1],
        }));
        yield put({
          type: 'save',
          payload: {
            mapList,
          },
        });
        callback && callback(true, mapList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取承包商列表
    *getContractorList({ payload, callback }, { call, put }) {
      const response = yield call(getContractorList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const contractorList = data.list;
        yield put({
          type: 'save',
          payload: {
            contractorList,
          },
        });
        callback && callback(true, contractorList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取供应商列表
    *getSupplierList({ payload, callback }, { call, put }) {
      const response = yield call(getSupplierList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const supplierList = data.list;
        yield put({
          type: 'save',
          payload: {
            supplierList,
          },
        });
        callback && callback(true, supplierList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取网格列表
    *getGridList({ payload, callback }, { call, put }) {
      const response = yield call(getGridList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridList = data.list;
        yield put({
          type: 'save',
          payload: {
            gridList,
          },
        });
        callback && callback(true, gridList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取网格列表（含人员统计）
    *getGridListWithCount({ payload, callback }, { call, put }) {
      const response = yield call(getGridListWithCount, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridListWithCount = data.list;
        yield put({
          type: 'save',
          payload: {
            gridListWithCount,
          },
        });
        callback && callback(true, gridListWithCount);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取网格人员列表
    *getGridPersonList({ payload, callback }, { call, put }) {
      const response = yield call(getGridPersonList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridPersonList = data;
        yield put({
          type: 'save',
          payload: {
            gridPersonList,
          },
        });
        callback && callback(true, gridPersonList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取网格企业列表
    *getGridCompanyList({ payload, callback, ignore }, { call, put }) {
      const response = yield call(getGridCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridCompanyList = data;
        if (!ignore) {
          yield put({
            type: 'save',
            payload: {
              gridCompanyList,
            },
          });
        }
        callback && callback(true, gridCompanyList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 根据用户所在网格获取企业列表
    *getGridCompanyListByUser({ payload, callback, ignore }, { call, put }) {
      const response = yield call(getGridCompanyListByUser, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridCompanyListByUser = data;
        if (!ignore) {
          yield put({
            type: 'save',
            payload: {
              gridCompanyListByUser,
            },
          });
        }
        callback && callback(true, gridCompanyListByUser);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取检查内容列表
    *getExaminationContentList({ payload, callback }, { call, put }) {
      const response = yield call(getExaminationContentList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const examinationContentList = data;
        yield put({
          type: 'save',
          payload: {
            examinationContentList,
          },
        });
        callback && callback(true, examinationContentList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取业务分类列表
    *getBusinessTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getBusinessTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.businessType) {
        const businessTypeList = data.businessType;
        yield put({
          type: 'save',
          payload: {
            businessTypeList,
          },
        });
        callback && callback(true, businessTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取所属行业列表
    *getIndustryList({ payload, callback }, { call, put }) {
      const response = yield call(getIndustryList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const industryList = data.list;
        yield put({
          type: 'save',
          payload: {
            industryList,
          },
        });
        callback && callback(true, industryList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取流程列表
    *getFlowList({ payload, callback }, { call, put }) {
      const response = yield call(getFlowList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const flowList = data;
        yield put({
          type: 'save',
          payload: {
            flowList,
          },
        });
        callback && callback(true, flowList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取专项整治组列表
    *getSpecialRemediationSectionList({ payload, callback }, { call, put }) {
      const response = yield call(getSpecialRemediationSectionList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const specialRemediationSectionList = data;
        yield put({
          type: 'save',
          payload: {
            specialRemediationSectionList,
          },
        });
        callback && callback(true, specialRemediationSectionList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取专项整治组详情
    *getSpecialRemediationSectionDetail({ payload, callback }, { call, put }) {
      const response = yield call(getSpecialRemediationSectionDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const specialRemediationSectionDetail = data;
        yield put({
          type: 'save',
          payload: {
            specialRemediationSectionDetail,
          },
        });
        callback && callback(true, specialRemediationSectionDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取安全服务机构列表
    *getSafetyServiceList({ payload, callback }, { call, put }) {
      const response = yield call(getSafetyServiceList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const safetyServiceList = data;
        yield put({
          type: 'save',
          payload: {
            safetyServiceList,
          },
        });
        callback && callback(true, safetyServiceList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取安全服务机构列表（所有）
    *getSafetyServiceList2({ payload, callback }, { call, put }) {
      const response = yield call(getSafetyServiceList2, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const safetyServiceList2 = data;
        yield put({
          type: 'save',
          payload: {
            safetyServiceList2,
          },
        });
        callback && callback(true, safetyServiceList2);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取安全服务机构列表（含人员统计）
    *getSafetyServiceListWithCount({ payload, callback, ignore }, { call, put }) {
      const response = yield call(getSafetyServiceListWithCount, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const safetyServiceListWithCount = data;
        if (!ignore) {
          yield put({
            type: 'save',
            payload: {
              safetyServiceListWithCount,
            },
          });
        }
        callback && callback(true, safetyServiceListWithCount);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取账号列表
    *getAccountList({ payload, callback }, { call, put }) {
      const response = yield call(getAccountList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const accountList = data;
        yield put({
          type: 'save',
          payload: {
            accountList,
          },
        });
        callback && callback(true, accountList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取员工列表
    *getEmployeeList({ payload, callback }, { call, put }) {
      const response = yield call(getEmployeeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const employeeList = data;
        yield put({
          type: 'save',
          payload: {
            employeeList,
          },
        });
        callback && callback(true, employeeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 被检查单位列表
    *getCheckedCompanyList({ payload, callback, ignore }, { call, put }) {
      const response = yield call(getCheckedCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const checkedCompanyList = data;
        if (!ignore) {
          yield put({
            type: 'save',
            payload: {
              checkedCompanyList,
            },
          });
        }
        callback && callback(true, checkedCompanyList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 根据用户权限获取网格树（吕旻）
    *getGridTreeByUser({ payload, callback, ignore }, { call, put }) {
      const response = yield call(getGridTreeByUser, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const gridTreeByUser = data.list;
        if (!ignore) {
          yield put({
            type: 'save',
            payload: {
              gridTreeByUser,
            },
          });
        }
        callback && callback(true, gridTreeByUser);
      } else {
        callback && callback(false, msg);
      }
    },
    // 根据企业获取人员列表（汤归）
    *getPersonListByCompany({ payload, callback }, { call, put }) {
      const response = yield call(getPersonListByCompany, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const personListByCompany = data;
        yield put({
          type: 'save',
          payload: {
            personListByCompany,
          },
        });
        callback && callback(true, personListByCompany);
      } else {
        callback && callback(false, msg);
      }
    },
    // 根据企业获取部门树（陈涛）
    *getDepartmentTreeByCompany({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTreeByCompany, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const departmentTreeByCompany = data.list;
        yield put({
          type: 'save',
          payload: {
            departmentTreeByCompany,
          },
        });
        callback && callback(true, departmentTreeByCompany);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取绩效考核标准列表（汤归）
    *getPerformanceMeasurementStandardList({ payload, callback }, { call, put }) {
      const response = yield call(getPerformanceMeasurementStandardList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const performanceMeasurementStandardList = data;
        yield put({
          type: 'save',
          payload: {
            performanceMeasurementStandardList,
          },
        });
        callback && callback(true, performanceMeasurementStandardList);
      } else {
        callback && callback(false, msg);
      }
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
  },
};
