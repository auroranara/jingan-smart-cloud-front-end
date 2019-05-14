import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  Select,
  message,
  Icon,
  Popover,
  Tree,
  TreeSelect,
  Spin,
  AutoComplete,
  Checkbox,
  Table,
  Tabs,
} from 'antd';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import AuthorityTree from './AuthorityTree';
import AppAuthorityTree from './AppAuthorityTree';
import {
  FIELD_LABELS as fieldLabels,
  DEFAULT_PAGE_SIZE as defaultPageSize,
  SUPERVISIONS,
  SUPERVISIONS_ALL,
  renderSearchedTreeNodes,
  getParentKeys,
  getTreeListChildrenMap,
  handleMtcTreeViolently as handleMtcTree,
  mergeArrays,
  getNoRepeat,
  addParentKey,
  removeParentKey,
  treeData,
  generateUnitsTree,
  getIdMaps,
  sortTree,
} from './utils';
import { MAI, GOV, OPE, COM } from '@/pages/RoleAuthorization/Role/utils';
import styles from './AccountManagementEdit.less';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const editTitle = '编辑账号';
const addTitle = '新增账号';
const href = '/role-authorization/account-management/list'; // 返回地址

// 1.编辑账号基本信息  2.新增账号基本信息和第一个关联单位
@connect(
  ({ account, role, user, loading }) => ({
    account,
    role,
    user,
    loading: loading.models.account,
    loadingEffects: loading.effects,
  }),
  dispatch => ({
    // 修改账号
    updateAccountDetail(action) {
      dispatch({
        type: 'account/updateAccountDetail',
        ...action,
      });
    },

    // 新增账号
    addAccount(action) {
      dispatch({
        type: 'account/addAccount',
        ...action,
      });
    },

    // 获取账号详情
    fetchAccountDetail(action) {
      dispatch({
        type: 'account/fetchAccountDetail',
        ...action,
      });
    },

    // 获取单位类型与账号状态
    fetchOptions(action) {
      dispatch({
        type: 'account/fetchOptions',
        ...action,
      });
    },

    // 新增账号-根据单位类型和名称模糊搜索
    fetchUnitsFuzzy(action) {
      dispatch({
        type: 'account/fetchUnitListFuzzy',
        ...action,
      });
    },

    // 返回列表页面
    goBack() {
      dispatch(routerRedux.push('/role-authorization/account-management/list'));
    },

    // 检验是否符合规则
    checkAccountOrPhone(action) {
      dispatch({
        type: 'account/checkAccountOrPhone',
        ...action,
      });
    },

    // 清除详情
    clearDetail() {
      dispatch({
        type: 'account/clearDetail',
      });
    },

    // 获取角色列表
    fetchRoles(action) {
      dispatch({
        type: 'account/fetchRoles',
        ...action,
      });
    },

    // 跳转到500
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },

    // 获取执法证件种类
    fetchExecCertificateType() {
      dispatch({
        type: 'account/fetchExecCertificateType',
      });
    },

    // 获取用户角色
    fetchUserType() {
      dispatch({
        type: 'account/fetchUserType',
      });
    },

    // 获取部门列表树
    fetchDepartmentList(action) {
      dispatch({
        type: 'account/fetchDepartmentList',
        ...action,
      });
    },
    fetchGrids(action) {
      dispatch({ type: 'account/fetchGrids', ...action });
    },
    dispatch,
  })
)
@Form.create()
export default class AccountManagementEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  state = {
    unitTypeChecked: undefined,
    subExpandedKeys: [],
    searchSerValue: '',
    searchSubValue: '',
    checkedRootKey: undefined,
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      fetchAccountDetail,
      match: {
        params: { id },
      },
      fetchGrids,
      fetchOptions,
      goToException,
      fetchUnitsFuzzy,
      clearDetail,
      fetchRoles,
      fetchExecCertificateType,
      fetchUserType,
      user: { currentUser: { unitType, unitId } },
    } = this.props;

    const isUnitUser = this.isUnitUser();
    dispatch({ type: 'account/saveMaintenanceTree', payload: {} }); // 清空维保权限树
    dispatch({ type: 'account/saveTrees', payload: {} }); // 清空权限树
    this.clearRolePermissions(COM); // 清空所选角色的permissions

    fetchGrids(); // 获取网格点树
    fetchOptions({ // 获取单位类型和账户状态
      success: ({ unitType: unitTypes }) => {
        if (isUnitUser) {
          this.setState({ unitTypeChecked: +unitType });
        }
        else if (unitTypes && unitTypes.length) {
          this.setState({ unitTypeChecked: COM }); // 默认选取第一个类型
          fetchUnitsFuzzy({ // 获取单位类型成功以后根据第一个单位类型获取对应的所属单位列表
            payload: {
              unitType: COM,
              pageNum: 1,
              pageSize: defaultPageSize,
            },
          });
        }
      },
    });

    if (id) { // 编辑账号基础信息
      fetchAccountDetail({
        payload: {
          id,
        },
        error: () => {
          goToException();
        },
      });
    } else { // 新增账号及第一个关联单位
      clearDetail();
      // 获取角色列表
      let actions;
      if (isUnitUser)
        actions = {
          payload: { unitType, companyId: unitId },
          success: this.genRolesSuccess(unitType),
          error: goToException,
        };
      else
        actions = {
          payload: { unitType: COM },
          success: this.genRolesSuccess(COM),
          error: goToException,
        };
      fetchRoles(actions);
      // 获取执法证件种类
      fetchExecCertificateType({
        error: goToException,
      });
      // 获取用户角色
      fetchUserType({
        error: goToException,
      });
    }
  }

  childrenMap = {};
  idMap = {};
  parentIdMap = {};
  permissions = [];
  authTreeCheckedKeys = [];
  appIdMap = {};
  appParentIdMap = {};
  appPermissions = [];
  appAuthTreeCheckedKeys = [];

  isUnitUser = () => {
    const { user: { currentUser: { unitId, unitType } } } = this.props;
    return unitId && +unitType !== OPE;
  };

  genRolesSuccess = unitType => (list, trees) => {
    const isAdmin = +unitType === OPE;
    let { webPermissions, appPermissions } = trees;
    webPermissions = webPermissions || [];
    appPermissions = appPermissions || [];
    this.setIdMaps(getIdMaps(webPermissions));
    this.setAppIdMaps(getIdMaps(appPermissions));
    [webPermissions, appPermissions].forEach(tree => sortTree(tree));
    this.setPermissions();
    !isAdmin && this.setAppPermissions();
  };

  setIdMaps = idMaps => {
    [this.parentIdMap, this.idMap] = idMaps;
  };

  setAppIdMaps = idMaps => {
    [this.appParentIdMap, this.appIdMap] = idMaps;
  };

  //获取维保权限树
  getMaintenanceTree = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchMaintenanceTree',
      payload: { companyId },
      callback: ({ list: treeList = [] }) => {
        this.childrenMap = getTreeListChildrenMap(treeList);
      },
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  handleClearSpace = e => e.target.value.replace(/\s/g, '');

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      updateAccountDetail,
      addAccount,
      goBack,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
    } = this.props;
    const { unitTypeChecked, checkedRootKey } = this.state;

    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (
        error,
        {
          loginName,
          accountStatus,
          userName,
          phoneNumber,
          unitType,
          unitId,
          treeIds,
          password,
          roleId,
          departmentId,
          gridIds,
          userType,
          documentTypeId,
          execCertificateCode,
          regulatoryClassification,
          permissions,
          appPermissions,
          serCheckedKeys = [],
          subCheckedKeys = [],
          isCheckAll,
        }
      ) => {
        if (!error) {
          const success = () => {
            const msg = id ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, goBack);
          };
          const error = err => {
            message.error(err, 1);
          };
          // 数据权限所有选中的key值
          const checkedKeys = [...serCheckedKeys, ...subCheckedKeys];
          const maintenacePermissions = handleMtcTree(checkedKeys, this.childrenMap);

          if (id) { // 编辑账号基本信息
            updateAccountDetail({
              payload: {
                loginId: id,
                loginName,
                userName,
                phoneNumber,
                accountStatus,
              },
              success,
              error,
            });
          } else { // 新增账号及第一个关联企业
            const payload = {
              id,
              loginName,
              password: password && password.trim(),
              accountStatus,
              userName,
              phoneNumber,
              unitType,
              unitId: unitId ? (unitTypeChecked === GOV ? unitId.value : unitId.key) : null,
              treeIds: treeIds ? treeIds.key : null,
              maintenacePermissions: isCheckAll ? [checkedRootKey] : maintenacePermissions,
              roleId,
              departmentId: Array.isArray(departmentId) ? undefined : departmentId,
              gridIds: Array.isArray(gridIds) ? gridIds.join(',') : '',
              userType,
              documentTypeId,
              execCertificateCode,
              regulatoryClassification:
                regulatoryClassification && regulatoryClassification.length
                  ? regulatoryClassification.join(',')
                  : null,
              permissions: addParentKey(
                getNoRepeat(permissions, this.permissions),
                this.parentIdMap
              ).join(','),
              appPermissions: addParentKey(
                getNoRepeat(appPermissions, this.appPermissions),
                this.appParentIdMap
              ).join(','),
            };
            switch (payload.unitType) {
              case MAI: // 维保企业
                payload.userType = 'company_safer';
                break;
              case OPE: // 运营企业
                payload.userType = 'admin';
                break;
              default:
                break;
            }

            addAccount({ payload, success, error });
          }
        }
      }
    );
  };

  // 单位类型下拉框中的值发生改变时调用
  handleUnitTypesChange = id => {
    const { fetchRoles } = this.props;
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;

    // 非combox模式下，即单选时Select的onChange, onSelect几乎一样，只需要用一个即可，所以将下面的onSelect函数合并上来
    // 不同的地方在于，再次选择时，若选择了和上次一样的选项，则会出发onselect，但是由于Select框的值并未发生改变，所以不会触发onchange事件
    this.handleUnitTypeSelect(id);

    this.setState(
      { unitTypeChecked: id },
      () => {
        if (id === COM) {
          setFieldsValue({ userType: 'company_legal_person' });
        } else {
          setFieldsValue({ userType: undefined });
        }

        if (id === COM || id === GOV)
          setFieldsValue({ regulatoryClassification: SUPERVISIONS_ALL });
      }
    );

    // 单位类型改变时，清空已选角色及已选权限
    const unitId = getFieldValue('unitId');
    fetchRoles({ payload: { unitType: id, companyId: unitId }, success: this.genRolesSuccess(id) });
    setFieldsValue({ roleId: undefined });
    this.clearRolePermissions(id);
  };

  // 单位类型下拉框选择
  handleUnitTypeSelect = value => {
    const {
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({ unitId: undefined, departmentId: undefined }); // 清除所属单位、所属部门

    const payload = { unitType: value };
    if (value !== GOV) {
      payload.pageNum = 1;
      payload.pageSize = defaultPageSize;
    }
    fetchUnitsFuzzy({ payload }); // 根据当前选中的单位类型获取对应的所属单位列表
  };

  // 所属单位下拉框输入
  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    // 根据输入值获取列表
    const unitType = getFieldValue('unitType');
    if (unitType !== undefined && unitType !== null) {
      fetchUnitsFuzzy({
        payload: {
          unitType: unitType,
          unitName: value && value.trim(),
          pageNum: 1,
          pageSize: defaultPageSize,
        },
      });
    }
    // 清除数据权限输入框的值
    setFieldsValue({ treeIds: undefined, departmentId: undefined, roleId: undefined });
  };

  // 所属单位下拉框选择
  handleDataPermissions = value => {
    const {
      fetchRoles,
      fetchDepartmentList,
      form: { setFieldsValue, resetFields },
    } = this.props;
    const { unitTypeChecked } = this.state;

    // 根据value从源数组中筛选出对应的数据，获取其值
    setFieldsValue({ treeIds: value, roleId: undefined });
    fetchDepartmentList({
      payload: { companyId: value.key },
    });
    // 清空维保权限数据
    this.setState({
      subExpandedKeys: [],
      searchSerValue: '',
      searchSubValue: '',
      checkedRootKey: undefined,
    });
    resetFields([
      'serCheckedKeys',
      'subCheckedKeys',
      'isCheckAll',
      'isCheckAllSub',
      'isCheckAllSer',
    ]);
    // 只有类型是维保单位的时候才请求维保树
    unitTypeChecked === MAI && this.getMaintenanceTree(value.key);
    // 单位类型和所属单位变化时角色列表都会发生变化
    fetchRoles({ payload: { unitType: unitTypeChecked, companyId: value.key }, success: this.genRolesSuccess(unitTypeChecked) });
  };

  handleGovSelect = ({ value, label }) => {
    const {
      fetchRoles,
      fetchDepartmentList,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      roleId: undefined,
      treeIds: { key: value, label },
    });
    fetchDepartmentList({
      payload: {
        companyId: value,
      },
    });
    fetchRoles({ payload: { unitType: GOV, companyId: value }, success: this.genRolesSuccess(GOV) });
  };

  /** 所属单位下拉框失焦 */
  handleUnitIdBlur = value => {
    const {
      fetchRoles,
      fetchUnitsFuzzy,
      account: { unitIds },
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const unitType = getFieldValue('unitType');
    const isUnitTypeExist = unitType !== undefined && unitType !== null;
    let rolePayload;

    setFieldsValue({ roleId: undefined });
    if (value && value.key === value.label) { // 根据value判断是否是手动输入
      this.handleUnitIdChange.cancel();
      // 从源数组中筛选出当前值对应的数据，如果存在，则将对应的数据为所属单位下拉框重新赋值
      const unitId = unitIds.filter(item => item.name === value.label)[0];
      if (unitId) {
        const treeIds = {
          key: unitId.id,
          label: unitId.name,
        };
        setFieldsValue({
          unitId: treeIds,
          treeIds,
        });
        if (isUnitTypeExist)
          rolePayload = { unitType, companyId: unitId };
      } else {
        setFieldsValue({
          unitId: undefined,
          treeIds: undefined,
        });
        if (isUnitTypeExist) {
          fetchUnitsFuzzy({
            payload: {
              unitType,
              pageNum: 1,
              pageSize: defaultPageSize,
            },
          });
          rolePayload = { unitType };
        }
      }
      fetchRoles({ payload: rolePayload, success: this.genRolesSuccess(unitType) });
    }
  };

  /* 异步验证用户名 */
  validateUserName = (rule, value, callback) => {
    if (value) {
      const { checkAccountOrPhone } = this.props;
      checkAccountOrPhone({
        payload: {
          loginName: value,
        },
        callback(res) {
          if (res.code === 200) callback();
          else callback(res.msg);
        },
      });
    } else callback();
  };

  /* 维保权限全选 */
  handleCheckAll = (isCheckAll, checkedRootKey) => {
    const {
      form: { setFieldsValue },
      account: { maintenanceSerTree = [], maintenanceSubTree = [] },
    } = this.props;
    const serCheckedKeys = isCheckAll ? maintenanceSerTree.map(item => item.key) : [];
    const subCheckedKeys = isCheckAll ? maintenanceSubTree.map(item => item.key) : [];
    const isCheckAllSub = isCheckAll,
      isCheckAllSer = isCheckAll;
    let fields = { isCheckAll };
    maintenanceSerTree.length > 0 && Object.assign(fields, { isCheckAllSer, serCheckedKeys });
    maintenanceSubTree.length > 0 && Object.assign(fields, { isCheckAllSub, subCheckedKeys });
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? checkedRootKey : undefined });
  };

  /* 监听勾选全部服务单位 */
  handleCheckAllSer = e => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list: treeList = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
    } = this.props;
    const checked = e.target.checked;
    if (checked) {
      const isCheckAllSub = maintenanceSubTree.length === 0 || getFieldValue('isCheckAllSub');
      // 服务单位第一层keys
      const serCheckedKeys = maintenanceSerTree.map(item => item.key);
      // 如果分公司没有数据，服务单位就是全选状态
      setFieldsValue({
        isCheckAll: maintenanceSubTree.length === 0 || isCheckAllSub,
        serCheckedKeys,
      });
      this.setState({ checkedRootKey: isCheckAllSub ? treeList[0].key : undefined });
    } else {
      setFieldsValue({ isCheckAll: false, serCheckedKeys: [] });
      this.setState({ checkedRootKey: undefined });
    }
  };

  /* 监听勾选全部分公司 */
  handleCheckAllSub = e => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list: treeList = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
    } = this.props;
    const checked = e.target.checked;
    if (checked) {
      const isCheckAllSer = maintenanceSerTree.length === 0 || getFieldValue('isCheckAllSer');
      // 分公司第一次层keys
      const subCheckedKeys = maintenanceSubTree.map(item => item.key);
      setFieldsValue({
        isCheckAll: maintenanceSerTree.length === 0 || isCheckAllSer,
        subCheckedKeys,
      });
      this.setState({ checkedRootKey: isCheckAllSer ? treeList[0].key : undefined });
    } else {
      setFieldsValue({ isCheckAll: false, subCheckedKeys: [] });
      this.setState({ checkedRootKey: undefined });
    }
  };

  // 勾选服务单位
  onSerCheck = serCheckedKeys => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list = [] },
        maintenanceSerTree = [], // 服务单位公司列表
        maintenanceSubTree = [], // 分公司列表
      },
    } = this.props;
    // 因为服务单位理论上没有children，所以判断length
    const isCheckAllSer = maintenanceSerTree.length === serCheckedKeys.length;
    // 如果分公司无数据，默认当作全选状态
    const isCheckAllSub = maintenanceSubTree.length === 0 || getFieldValue('isCheckAllSub');
    const isCheckAll = isCheckAllSer && isCheckAllSub;
    let fields = { serCheckedKeys, isCheckAll, isCheckAllSer };
    maintenanceSubTree.length > 0 && Object.assign(fields, { isCheckAllSub });
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? list[0].key : undefined });
  };

  // 勾选分公司及服务单位
  onSubCheck = subCheckedKeys => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [], // 分公司单位列表
      },
    } = this.props;
    const subKeys = maintenanceSubTree.map(item => item.key);
    const isCheckAllSer = getFieldValue('isCheckAllSer');
    const isCheckAllSub = this.isAContentsB(subCheckedKeys, subKeys);
    const isCheckAll = isCheckAllSer && isCheckAllSub;
    let fields = { subCheckedKeys, isCheckAll, isCheckAllSub };
    maintenanceSerTree.length > 0 && Object.assign(fields, { isCheckAllSer });
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? list[0].key : undefined });
  };

  isAContentsB = (a, b) => {
    for (const item of b) {
      if (!a.includes(item)) return false;
    }
    return true;
  };

  // 展开分公司及服务单位
  onSubExpand = subExpandedKeys => {
    this.setState({
      subExpandedKeys,
    });
  };

  // 判断两个字符串数组内容是否一样
  isArrContentSame = (first, second) => {
    return first.sort().join(',') === second.sort().join(',');
  };

  // 数据权限服务单位搜索
  onSerTreeSearch = (value, tree) => {
    this.setState({
      searchSerValue: value,
    });
  };

  // 数据权限子公司及服务单位搜索
  onSubTreeSearch = (value, tree) => {
    const subExpandedKeys = getParentKeys(tree, value);

    this.setState({
      subExpandedKeys,
      searchSubValue: value,
    });
  };

  // handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
  //   const {
  //     form: { setFieldsValue },
  //   } = this.props;
  //   setFieldsValue({ roleIds: nextTargetKeys });

  //   // // 穿梭框中有值
  //   // if (nextTargetKeys.length)
  //   //   this.fetchRolePermissions(nextTargetKeys);
  //   // // 穿梭框中没有值时，不需要请求服务器，本地清空即可
  //   // else
  //   //   this.clearRolePermissions();
  // };

  handleRoleChange = value => {
    this.fetchRolePermissions(value);
  };

  clearRolePermissions = unitType => {
    const { dispatch, form: { setFieldsValue } } = this.props;
    const isNotAdmin = unitType !== OPE;

    const values = { permissions: this.authTreeCheckedKeys };
      this.permissions = [];
      dispatch({ type: 'role/saveRolePermissions', payload: [] });
      if (isNotAdmin) {
        values.appPermissions = this.appAuthTreeCheckedKeys;
        this.appPermissions = [];
        dispatch({ type: 'role/saveRoleAppPermissions', payload: [] });
      }
      setFieldsValue(values);
  };

  fetchRolePermissions = id => {
    const { dispatch } = this.props;
    const { unitTypeChecked } = this.state;
    const isNotAdmin = unitTypeChecked !== OPE;

    // ids不为数组或者ids的长度为0，则本地清空
    if (!id)
      this.clearRolePermissions(unitTypeChecked);
    else
      dispatch({
        type: 'role/fetchRolePermissions',
        payload: { id },
        success: (permissions, appPermissions) => {
          this.permissions = permissions;
          this.setPermissions();
          if (isNotAdmin) {
            this.appPermissions = appPermissions;
            this.setAppPermissions();
          }
        },
      });
  };

  setPermissions = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      permissions: removeParentKey(
        mergeArrays(this.permissions, this.authTreeCheckedKeys),
        this.idMap
      ),
    });
  };

  // 当获取树和获取详情接口都返回时，才可以设值，但先后顺序没法控制，所以在两个接口返回时都调用当前函数，且在函数中通过loading来判断，是否两个接口都返回了，都返回了后再设值
  setAppPermissions = () => {
    const {
      loadingEffects,
      form: { setFieldsValue },
    } = this.props;
    const isloaded = !loadingEffects['account/fetchRoles'] && !loadingEffects['role/fetchDetail'];
    isloaded && setFieldsValue({
      appPermissions: removeParentKey(
        mergeArrays(this.appPermissions, this.appAuthTreeCheckedKeys),
        this.appIdMap
      ),
    });
  };

  handleChangeAuthTreeCheckedKeys = checkedKeys => {
    this.authTreeCheckedKeys = checkedKeys;
  };

  handleChangeAppAuthTreeCheckedKeys = checkedKeys => {
    this.appAuthTreeCheckedKeys = checkedKeys;
  };

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: {
        detail: {
          data: {
            loginName,
            userName,
            phoneNumber,
            accountStatus,
          },
        },
        unitTypes,
        accountStatuses,
        unitIds,
        documentTypeIds,
        departments,
        grids,
      },
      form: { getFieldDecorator },
      user: { currentUser: { unitId: userUnitId, unitName: userUnitName, unitType: userUnitType } },
      match: {
        params: { id },
      },
      loading,
    } = this.props;
    const { unitTypeChecked } = this.state;

    const isUnitUser = this.isUnitUser();
    const unitIdInitValue = userUnitId && userUnitName ? { key: userUnitId, label: userUnitName } : undefined;
    const isValidateLoginName = id ? [] : [{ validator: this.validateUserName }];
    const treeList = treeData(departments);
    const gridList = treeData(grids);

    return (
      <Card title="账号基本信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  initialValue: loginName,
                  getValueFromEvent: this.handleClearSpace,
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入用户名',
                    },
                    ...isValidateLoginName,
                  ],
                })(<Input placeholder="请输入用户名" min={1} max={20} />)}
              </Form.Item>
            </Col>
            {id ? null : (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.password}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        type: 'string',
                        message: '请输入密码',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入密码"
                      min={6}
                      max={20}
                      type="password"
                      autoComplete="new-password"
                    />
                  )}
                </Form.Item>
              </Col>
            )}
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
                  initialValue: id
                    ? accountStatus
                    : accountStatuses.length === 0
                      ? undefined
                      : accountStatuses[0].id,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'integer',
                      message: '请选择账号状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择账号状态">
                    {accountStatuses.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.userName}>
                {getFieldDecorator('userName', {
                  initialValue: userName,
                  getValueFromEvent: this.handleClearSpace,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入姓名',
                    },
                  ],
                })(<Input placeholder="请输入姓名" min={1} max={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.phoneNumber}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  getValueFromEvent: this.handleClearSpace,
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入手机号',
                    },
                  ],
                })(<Input placeholder="请输入手机号" min={11} max={11} />)}
              </Form.Item>
            </Col>
            {!id && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.unitType}>
                  {getFieldDecorator('unitType', {
                    initialValue: isUnitUser ? userUnitType : unitTypes.length ? unitTypes[0].id : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择单位类型',
                      },
                    ],
                  })(
                    <Select
                      disabled={isUnitUser}
                      placeholder="请选择单位类型"
                      onChange={this.handleUnitTypesChange}
                    >
                      {unitTypes.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            )}
            {!id &&
              unitTypeChecked !== GOV && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.unitId} className={styles.hasUnit}>
                    {getFieldDecorator('unitId', {
                      initialValue: unitIdInitValue,
                      rules: [
                        {
                          required: unitTypeChecked !== OPE, // 如果是运营企业 不需要必填,
                          transform: value => value && value.label,
                          message: '请选择所属单位',
                        },
                      ],
                    })(
                      <AutoComplete
                        labelInValue
                        mode="combobox"
                        disabled={isUnitUser}
                        optionLabelProp="children"
                        placeholder="请选择所属单位"
                        notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                        onSearch={this.handleUnitIdChange}
                        onSelect={this.handleDataPermissions}
                        onBlur={this.handleUnitIdBlur}
                        filterOption={false}
                      >
                        {unitIds.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </AutoComplete>
                    )}
                  </Form.Item>
                </Col>
              )}

            {!id &&
              unitTypeChecked === GOV && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.unitId}>
                    {getFieldDecorator('unitId', {
                      initialValue: unitIdInitValue,
                      rules: [
                        {
                          required: true, // 如果是运营企业 不需要必填,
                          message: '请选择所属单位',
                        },
                      ],
                    })(
                      <TreeSelect
                        labelInValue
                        disabled={isUnitUser}
                        placeholder="请选择所属单位"
                        onSelect={this.handleGovSelect}
                      >
                        {generateUnitsTree(unitIds)}
                      </TreeSelect>
                    )}
                  </Form.Item>
                </Col>
              )}

            {!id && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.departmentId}>
                  {getFieldDecorator('departmentId', {
                    // initialValue: [departmentId],
                  })(
                    <TreeSelect
                      allowClear
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择所属部门"
                    >
                      {treeList}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
            )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === COM &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.regulatoryClassification}>
                    {getFieldDecorator('regulatoryClassification', {
                      initialValue: SUPERVISIONS_ALL,
                      rules: [{ required: true, message: '请选择业务分类' }],
                    })(
                      <Select mode="multiple" placeholder="请选择业务分类">
                        {SUPERVISIONS.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === GOV && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.regulatoryClassification}>
                    {getFieldDecorator('regulatoryClassification', {
                      rules: [{ required: true, message: '请选择业务分类' }],
                    })(
                      <Select mode="multiple" placeholder="请选择业务分类">
                        {SUPERVISIONS.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === GOV &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.documentTypeId}>
                    {getFieldDecorator('documentTypeId', {
                      // initialValue: documentTypeId,
                    })(
                      <Select allowClear placeholder="请选择执法证种类">
                        {documentTypeIds.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === GOV &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.execCertificateCode}>
                    {getFieldDecorator('execCertificateCode', {
                      // initialValue: execCertificateCode,
                      rules: [
                        {
                          message: '请输入执法证编号',
                        },
                      ],
                    })(<Input placeholder="请输入执法证编号" />)}
                  </Form.Item>
                </Col>
              )}
            {!id && unitTypeChecked === GOV && (
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={fieldLabels.gridIds}>
                  {getFieldDecorator('gridIds', {
                  })(
                    <TreeSelect
                      allowClear
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择所属网格"
                    >
                      {gridList}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染角色权限信息 */
  renderRolePermission() {
    const {
      role: { rolePermissions, roleAppPermissions },
      account: {
        permissionTree,
        appPermissionTree,
        detail: {
          data: { treeNames, treeIds, roleId },
        },
        roles,
        maintenanceTree: { list: treeList = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
      form,
      loading,
    } = this.props;

    const { getFieldDecorator } = form;
    const { subExpandedKeys, searchSerValue, searchSubValue, unitTypeChecked } = this.state;

    return (
      <TabPane tab="角色权限配置" key="1" className={styles.tabPane}>
      {/* <Card title="角色权限配置" className={styles.card} bordered={false}> */}
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col sm={24} md={12} lg={8}>
              <Form.Item label={fieldLabels.roleId}>
                {getFieldDecorator('roleId', {
                  initialValue: roleId,
                  rules: [{ required: true, message: '请选择一个角色' }],
                })(
                  <Select
                    onChange={this.handleRoleChange}
                  >
                    {roles.map(({ id, roleName }) => <Option key={id} value={id}>{roleName}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="WEB账号权限">
                <AuthorityTree
                  form={form}
                  tree={permissionTree}
                  permissions={rolePermissions}
                  handleChangeAuthTreeCheckedKeys={this.handleChangeAuthTreeCheckedKeys}
                />
              </Form.Item>
            </Col>
            {(unitTypeChecked === MAI || unitTypeChecked === GOV || unitTypeChecked === COM) && (
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="APP账号权限">
                  <AppAuthorityTree
                    form={form}
                    tree={appPermissionTree}
                    permissions={roleAppPermissions}
                    handleChangeAuthTreeCheckedKeys={this.handleChangeAppAuthTreeCheckedKeys}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.treeIds}>
                {getFieldDecorator('treeIds', {
                  initialValue:
                    treeIds && treeNames ? { key: treeIds, label: treeNames } : undefined,
                })(
                  <AutoComplete
                    mode="combobox"
                    labelInValue
                    optionLabelProp="children"
                    placeholder="请选择单位名称"
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    filterOption={false}
                    disabled
                  >
                    {[].map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
                <p style={{ paddingTop: 10, fontSize: 12 }}>包括该组织下的所有数据</p>
              </Form.Item>
            </Col>
          </Row>
          {unitTypeChecked === MAI && treeList.length > 0 ? (
            <Row gutter={{ lg: 48, md: 24 }}>
              <Col lg={8} md={12} sm={24}>
                <p className={styles.dpTitle}>维保权限</p>
                <div className={styles.dpContent}>
                  <div className={styles.line}>
                    <span>
                      本单位：
                      {treeList[0].title}
                    </span>
                    {getFieldDecorator('isCheckAll', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        onChange={e => this.handleCheckAll(e.target.checked, treeList[0].key)}
                      >
                        全选
                      </Checkbox>
                    )}
                  </div>
                  <div className={styles.line}>
                    <span>本单位的服务单位：</span>
                    {maintenanceSerTree.length > 0 &&
                      getFieldDecorator('isCheckAllSer', {
                        valuePropName: 'checked',
                      })(<Checkbox onChange={this.handleCheckAllSer}>全选</Checkbox>)}
                    {maintenanceSerTree.length > 0 ? (
                      <Fragment>
                        <Search
                          placeholder="请输入单位名称查询"
                          onChange={e => this.onSerTreeSearch(e.target.value, maintenanceSerTree)}
                        />
                        {getFieldDecorator('serCheckedKeys', {
                          valuePropName: 'checkedKeys',
                        })(
                          <Tree checkable onCheck={this.onSerCheck}>
                            {renderSearchedTreeNodes(maintenanceSerTree, searchSerValue)}
                          </Tree>
                        )}
                      </Fragment>
                    ) : (
                      <span>暂无数据</span>
                    )}
                  </div>
                  <div className={styles.line}>
                    <span>分公司及其服务单位：</span>
                    {maintenanceSubTree.length > 0 &&
                      getFieldDecorator('isCheckAllSub', {
                        valuePropName: 'checked',
                      })(<Checkbox onChange={this.handleCheckAllSub}>全选</Checkbox>)}
                    {maintenanceSubTree.length > 0 ? (
                      <Fragment>
                        <Search
                          placeholder="请输入单位名称查询"
                          onChange={e => this.onSubTreeSearch(e.target.value, maintenanceSubTree)}
                        />
                        {getFieldDecorator('subCheckedKeys', {
                          valuePropName: 'checkedKeys',
                        })(
                          <Tree
                            checkable
                            onExpand={this.onSubExpand}
                            expandedKeys={subExpandedKeys}
                            onCheck={this.onSubCheck}
                          >
                            {renderSearchedTreeNodes(maintenanceSubTree, searchSubValue)}
                          </Tree>
                        )}
                      </Fragment>
                    ) : (
                      <span>暂无数据</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          ) : null}
        </Form>
      {/* </Card> */}
      </TabPane>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  renderMessageSubscription() {
    const columns = [
      { title: '消息类别', dataIndex: 'type', key: 'type' },
      { title: '是否配置', dataIndex: 'check', key: 'check',
        render: (txt, record) => (
          <Checkbox />
        ),
      },
    ];

    return (
      <TabPane tab="消息订阅配置" key="2" className={styles.tabPane1}>
        <Table
          className={styles.table}
          columns={columns}
        />
      </TabPane>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          onClick={this.handleClickValidate}
          loading={loading}
          style={{ fontSize: 16 }}
        >
          提交
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;
    const content = (
      <div>
        <p className={styles.desc}>
          {id
            ? '编辑账号基本信息'
            : '创建账号基本信息及新建第一个关联单位，并赋予角色权限'}
        </p>
      </div>
    );

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
      },
      {
        title: '角色权限',
        name: '角色权限',
      },
      {
        title: '账号管理',
        name: '账号管理',
        href,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
        content={content}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {!id && (
            <Tabs className={styles.tabs}>
              {this.renderRolePermission()}
              {this.renderMessageSubscription()}
            </Tabs>
          )}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
