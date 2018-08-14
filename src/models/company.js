import {
  queryCompanies,
  deleteCompany,
  queryDict,
  queryCompany,
  addCompany,
  updateCompany,
  queryMaintenanceCompanies,
  fetchArea,
  upload,
  gsafeQueryDict,
  gsafeQueryIndustryType,
  editScreenPermission,
  queryAddCompanyOptions,
} from '../services/company/company.js';

// const mergeArea = (area, ids, list) => {
//   return ids.length === 0
//   ? list
//   : area.map(province => {
//       if (province.id === ids[0]) {
//         if (ids.length !== 1) {
//           return {
//             ...province,
//             children: province.children.map(city => {
//               if (city.id === ids[1]) {
//                 if (ids.length !== 2) {
//                   return {
//                     ...city,
//                     children: city.children.map(district => {
//                       if (district.id === ids[2]) {
//                         return {
//                           ...district,
//                           children: list,
//                           loading: false,
//                         };
//                       }
//                       return district;
//                     }),
//                   };
//                 } else {
//                   return {
//                     ...city,
//                     children: list,
//                     loading: false,
//                   };
//                 }
//               }
//               return city;
//             }),
//           };
//         } else {
//           return {
//             ...province,
//             children: list,
//             loading: false,
//           };
//         }
//       }
//       return province;
//     });
// };

export default {
  namespace: 'company',

  state: {
    list: [],
    // 行业类别
    industryCategories: [],
    // 经济类型
    economicTypes: [],
    // 企业状态
    companyStatuses: [],
    // 规模情况
    scales: [],
    // 执照类别
    licenseTypes: [],
    // 注册地址
    registerAddress: [],
    // 实际地址
    practicalAddress: [],
    // 单位性质
    companyNatures: [],
    // 单位类型
    companyTypes: [],
    pageNum: 1,
    isLast: false,
    detail: {
      data: {
        businessScope: undefined,
        code: undefined,
        companyIchnography: undefined,
        companyStatus: undefined,
        createDate: undefined,
        economicType: undefined,
        groupName: undefined,
        industryCategory: undefined,
        latitude: undefined,
        licenseType: undefined,
        longitude: undefined,
        maintenanceContract: undefined,
        maintenanceId: undefined,
        name: undefined,
        scale: undefined,
        registerProvince: undefined,
        registerCity: undefined,
        registerDistrict: undefined,
        registerTown: undefined,
        registerAddress: undefined,
        practicalProvince: undefined,
        practicalCity: undefined,
        practicalDistrict: undefined,
        practicalTown: undefined,
        practicalAddress: undefined,
        legalName: undefined,
        legalPhone: undefined,
        legalEmail: undefined,
        principalName: undefined,
        principalPhone: undefined,
        principalEmail: undefined,
        safetyName: undefined,
        safetyPhone: undefined,
        safetyEmail: undefined,
        companyType: undefined,
      },
    },
    modal: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *appendFetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchDict(
      {
        payload: { type, key },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(queryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'queryDict',
          payload: {
            key,
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *gsafeFetchDict(
      {
        payload: { type, key },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(gsafeQueryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'queryDict',
          payload: {
            key,
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 获取行业类别 */
    *fetchIndustryType({ success, error }, { call, put }) {
      const response = yield call(gsafeQueryIndustryType, { parent_id: -1 });
      if (response.code === 200) {
        yield put({
          type: 'queryDict',
          payload: {
            key: 'industryCategories',
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(deleteCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 获取企业详情
    *fetchCompany({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryCompany',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *insertCompany({ payload, success, error }, { call }) {
      const response = yield call(addCompany, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    *editCompany({ payload, success, error }, { call, put }) {
      const response = yield call(updateCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateCompany',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryModalList',
          payload: response.data,
        });
      }
    },
    // 追加行政区域
    *fetchArea(
      {
        payload: { cityIds, keys },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(fetchArea, { cityIds });
      if (response.code === 200) {
        yield put({
          type: 'queryArea',
          payload: {
            list: response.data.list,
            keys,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 上传文件 */
    *upload({ payload, success, error }, { call }) {
      const response = yield call(upload, payload);
      if (response.code === 200) {
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *editScreenPermission({ payload, success, error }, { call }) {
      const response = yield call(editScreenPermission, payload);
      if (response.code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 新增企业-初始化页面选项
    *fetchOptions({ success, error }, { call, put }) {
      const response = yield call(queryAddCompanyOptions);
      if (response.code === 200) {
        yield put({
          type: 'queryOptions',
          payload: {
            data: response.data,
          },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    query(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list,
        pageNum: 1,
        isLast: pageNum * pageSize >= total,
      };
    },
    appendList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryDict(
      state,
      {
        payload: { key, list },
      }
    ) {
      return {
        ...state,
        [key]: list,
      };
    },
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
    queryCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // addCompany(state, { payload }) {
    //   return {
    //     ...state,
    //     detail: {
    //       ...state.detail,
    //       data: payload,
    //     },
    //   };
    // },
    updateCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    queryModalList(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },
    queryArea(
      state,
      {
        payload: { list, keys },
      }
    ) {
      const fields = {};
      keys.forEach(key => {
        fields[key] = list;
      });
      return {
        ...state,
        ...fields,
      };
    },
    // 清空详情
    clearDetail(state) {
      return {
        ...state,
        detail: {
          data: {},
        },
      };
    },
    updateScreenPermission(state, { payload }) {
      return {
        ...state,
        list: payload.list,
      };
    },
    queryOptions(
      state,
      {
        payload: {
          data: { companyType },
        },
      }
    ) {
      return {
        ...state,
        companyTypes: companyType,
      };
    },
  },
};
