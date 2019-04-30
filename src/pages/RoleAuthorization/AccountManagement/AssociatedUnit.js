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
  TreeSelect,
  Spin,
  Transfer,
  Tree,
  AutoComplete,
  Checkbox,
} from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import debounce from 'lodash/debounce';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import AuthorityTree from './AuthorityTree';
import AppAuthorityTree from './AppAuthorityTree';
import {
  renderSearchedTreeNodes,
  getInitParentKeys,
  getParentKeys,
  getTreeListChildrenMap,
  handleMtcTreeViolently as handleMtcTree,
  mergeArrays,
  getNoRepeat,
  addParentKey,
  removeParentKey,
  handleKeysString,
} from './utils';
import styles from './AccountManagementEdit.less';

const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const { Search } = Input;

// 编辑页面标题
const editTitle = '编辑关联单位';
// 添加页面标题
const addTitle = '关联单位';
// 返回地址
const href = '/role-authorization/account-management/list';

/* 表单标签 */
const fieldLabels = {
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
  treeIds: '数据权限',
  roleIds: '配置角色',
  departmentId: '所属部门',
  userType: '用户角色',
  documentTypeId: '执法证种类',
  execCertificateCode: '执法证编号',
  regulatoryClassification: '业务分类',
};

// 单位类型对应的id
// 企事业主体：4
// 运营企业：3
// 政府机构：2
// 维保企业：1
const UNIT_TYPE_FIX = { 4: 1, 3: 0, 2: 2, 1: 3 };

// 默认的所属单位长度
const defaultPageSize = 20;

const Supervisions = [
  { id: '1', label: '安全生产' },
  { id: '2', label: '消防' },
  { id: '3', label: '环保' },
  { id: '4', label: '卫生' },
];

const SUPERVISIONS_ALL = Supervisions.map(({ id }) => id);

const treeData = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.id} value={item.id} />;
  });
};

// 生成树节点
const generateTressNode = data => {
  return data.map(item => {
    if (item.child && item.child.length) {
      return (
        <TreeNode title={item.name} key={item.id} value={item.id}>
          {generateTressNode(item.child)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.id} value={item.id} />;
  });
};

@connect(
  ({ account, role, loading }) => ({
    account,
    role,
    loadingEffects: loading.effects,
    loading: loading.models.account,
    authorityTreeLoading: loading.effects['role/fetchPermissionTree'],
    appAuthorityTreeLoading: loading.effects['role/fetchAppPermissionTree'],
    editSubmitting: loading.effects['account/editAssociatedUnit'],
    addSubmitting: loading.effects['account/addAssociatedUnit'],
  }),
  dispatch => ({
    editAssociatedUnit(action) {
      dispatch({
        type: 'account/editAssociatedUnit',
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

    // 获取用户详情
    fetchAssociatedUnitDeatil(action) {
      dispatch({
        type: 'account/fetchAssociatedUnitDeatil',
        ...action,
      });
    },

    addAssociatedUnit(action) {
      dispatch({
        type: 'account/addAssociatedUnit',
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

    initValue() {
      dispatch({
        type: 'account/initValue',
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

    dispatch,
  })
)
@Form.create()
export default class AssociatedUnit extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  state = {
    unitTypeChecked: undefined,
    submitting: false,
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
      fetchAssociatedUnitDeatil,
      match: {
        params: { id, userId },
      },
      fetchOptions,
      goToException,
      fetchUnitsFuzzy,
      initValue,
      fetchRoles,
      fetchExecCertificateType,
      fetchUserType,
      fetchDepartmentList,
      form: { setFieldsValue },
    } = this.props;
    const success = userId
      ? undefined
      : ({ unitType: unitTypes }) => {
          // 默认选取第一个类型
          unitTypes && unitTypes.length && this.setState({ unitTypeChecked: unitTypes[0].id });
          // 获取单位类型成功以后根据第一个单位类型获取对应的所属单位列表
          unitTypes &&
            unitTypes.length &&
            fetchUnitsFuzzy({
              payload: {
                unitType: unitTypes[0].id,
                pageNum: 1,
                pageSize: defaultPageSize,
              },
            });
        };

    // 清空权限树
    dispatch({ type: 'account/saveMaintenanceTree', payload: {} });
    // 获取单位类型和账户状态
    fetchOptions({
      success,
    });
    if (!!userId) { // 编辑
      fetchAssociatedUnitDeatil({
        payload: {
          userId,
        },
        success: ({
          unitType,
          unitId,
          regulatoryClassification,
          roleIds,
          permissions = '',
          appPermissions = '',
          maintenacePermissions = [],
        }) => {
          this.setState(
            {
              unitTypeChecked: unitType,
            },
            () => {}
          );
          // 根据企业类型获取对应类型的角色
          fetchRoles({
            payload: { unitType },
            error: goToException,
          });
          // 若为维保单位，则获取维保权限树，并设置维保权限树初值
          unitType === 1 &&
            this.getMaintenanceTree({
              payload: { companyId: unitId },
              callback: ({ list: treeList = [], maintenanceSerTree, maintenanceSubTree }) => {
                if (treeList.length === 0) return;
                this.childrenMap = getTreeListChildrenMap(treeList);
                let serCheckedKeys = [];
                let subCheckedKeys = [];
                const rootKey = treeList[0].key || null;
                // 服务单位keys
                const serKeys = maintenanceSerTree.map(item => item.key);
                const subKeys = maintenanceSubTree.map(item => item.key);
                const isCheckAll = maintenacePermissions.includes(rootKey);
                // 将maintenacePermissions拆分成服务单位和分公司及下属
                if (isCheckAll) {
                  serCheckedKeys = serKeys;
                  subCheckedKeys = subKeys;
                } else {
                  const newPermission = maintenacePermissions.filter(item => item !== rootKey);
                  if (newPermission.length > 0) {
                    for (const item of newPermission) {
                      const index = serKeys.indexOf(item);
                      if (index > -1) {
                        serCheckedKeys.push(item);
                      } else {
                        subCheckedKeys.push(item);
                      }
                    }
                  }
                }
                const isCheckAllSer =
                  isCheckAll || serCheckedKeys.length === maintenanceSerTree.length;
                const isCheckAllSub = isCheckAll || this.isArrContentSame(subCheckedKeys, subKeys);
                let fields = { isCheckAll };
                maintenanceSerTree.length > 0 &&
                  Object.assign(fields, { serCheckedKeys, isCheckAllSer });
                maintenanceSubTree.length > 0 &&
                  Object.assign(fields, { subCheckedKeys, isCheckAllSub });

                setFieldsValue(fields);

                const subExpandedKeys =
                  maintenanceSubTree.length > 0
                    ? getInitParentKeys(maintenanceSubTree, subCheckedKeys)
                    : [];
                // 展开分公司tree
                this.setState({
                  subExpandedKeys,
                  checkedRootKey: isCheckAll ? rootKey : undefined,
                });
              },
            });
          /* 初始化业务分类 */
          (unitType === 2 || unitType === 4) &&
            setFieldsValue({
              regulatoryClassification: regulatoryClassification
                ? regulatoryClassification.split(',').filter(v => v)
                : [],
            });
          // 获取roleIds对应的权限，并设置权限树的初值
          this.authTreeCheckedKeys = handleKeysString(permissions);
          this.appAuthTreeCheckedKeys = handleKeysString(appPermissions);
          const roles = roleIds.split(',');
          roles.length && this.fetchRolePermissions(roles);

          // 获取单位类型成功以后根据第一个单位类型获取对应的所属单位列表
          fetchUnitsFuzzy({
            payload: {
              unitType: unitType,
              pageNum: 1,
              pageSize: defaultPageSize,
            },
          });
          if (unitId) {
            fetchDepartmentList({
              payload: {
                companyId: unitId,
              },
              error: goToException,
            });
          }
        },
        error: () => {
          goToException();
        },
      });
    } else { // 新增
      fetchAccountDetail({
        payload: { id },
        error: () => { goToException(); },
      });
      initValue();
    }

    // 获取执法证件种类
    fetchExecCertificateType({
      error: goToException,
    });

    // 获取用户角色
    fetchUserType({
      error: goToException,
    });
  }

  childrenMap = {};
  idMap = {};
  appIdMap = {};
  parentIdMap = {};
  appParentIdMap = {};
  permissions = [];
  appPermissions = [];
  authTreeCheckedKeys = [];
  appAuthTreeCheckedKeys = [];


  setIdMaps = idMaps => {
    [this.parentIdMap, this.idMap] = idMaps;
  };

  setAppIdMaps = idMaps => {
    [this.appParentIdMap, this.appIdMap] = idMaps;
  };

  // 判断两个字符串数组内容是否一样
  isArrContentSame = (first, second) => {
    return first.sort().join(',') === second.sort().join(',');
  };

  //获取维保权限树
  getMaintenanceTree = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchMaintenanceTree',
      ...actions,
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 返回列表
  goBack = () => {
    router.push('/role-authorization/account-management/list');
  };

  /* 提交表单信息 */
  handleClickValidate = () => {
    const {
      addAssociatedUnit,
      editAssociatedUnit,
      form: { validateFieldsAndScroll },
      match: {
        params: { id, userId },
      },
      account: {
        roles,
        detail: {
          data: { loginId, active },
        },
      },
    } = this.props;
    const { unitTypeChecked, checkedRootKey } = this.state;
    const roleIdList = roles.map(({ id }) => id);

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
          roleIds,
          departmentId,
          userType,
          documentTypeId = null,
          execCertificateCode = null,
          regulatoryClassification,
          permissions,
          appPermissions,
          serCheckedKeys = [],
          subCheckedKeys = [],
          isCheckAll,
        }
      ) => {
        if (!error) {
          this.setState({
            submitting: true,
          });
          // 数据权限所有选中的key值
          const checkedKeys = [...serCheckedKeys, ...subCheckedKeys];
          const maintenacePermissions = handleMtcTree(checkedKeys, this.childrenMap);
          let payload = {
            loginName: loginName.trim(),
            accountStatus,
            userName,
            phoneNumber,
            unitType,
            unitId: unitId ? (unitTypeChecked === 2 ? unitId.value : unitId.key) : null,
            treeIds: treeIds ? treeIds.key : null,
            maintenacePermissions: isCheckAll ? [checkedRootKey] : maintenacePermissions,
            roleIds: roleIds.filter(id => roleIdList.includes(id)).join(','), // 处理脏数据，在提交时将不在列表中的roleId排除
            departmentId: departmentId || '',
            userType,
            documentTypeId, // 执法证种类id
            execCertificateCode, // 执法证编号
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
          switch (payload.unitType) { //单位类型
            // 维保企业 设置用户角色
            case 1:
              payload.userType = 'company_safer';
              break;
            // 运营企业
            case 3:
              payload.userType = 'admin';
              break;
            default:
              break;
          }
          const successCallback = () => {
            const msg = userId ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, this.goBack());
          };
          const errorCallback = err => {
            message.error(err, 1);
            this.setState({
              submitting: false,
            });
          };
          // 如果有userId，为编辑
          if (userId) {
            payload = { ...payload, active, id: userId, loginId };

            editAssociatedUnit({
              payload,
              successCallback,
              errorCallback,
            });
          } else {
            payload.loginId = id;
            addAssociatedUnit({
              payload,
              successCallback,
              errorCallback,
            });
          }
        }
      }
    );
  };

  // 单位类型下拉框中的值发生改变时调用
  handleUnitTypesChange = id => {
    // 非combox模式下，即单选时Select的onChange, onSelect几乎一样，只需要用一个即可，所以将下面的onSelect函数合并上来
    // 不同的地方在于，再次选择时，若选择了和上次一样的选项，则会出发onselect，但是由于Select框的值并未发生改变，所以不会触发onchange事件
    this.handleUnitTypeSelect(id);
    const {
      fetchRoles,
      account: { detail },
      form: { setFieldsValue },
    } = this.props;
    const { data } = detail || {};
    const { unitType, roleIds } = data || {};

    this.setState(
      {
        unitTypeChecked: id,
      },
      () => {
        setFieldsValue({
          userType: null,
          regulatoryClassification: id === 4 || id === 2 ? SUPERVISIONS_ALL : [],
          documentTypeId: null,
          execCertificateCode: null,
        });
      }
    );

    // 单位类型改变时，改变角色列表，若与原有单位类型相同，则保留原来的值，若不同则清空已选角色及已选权限
    fetchRoles({ payload: { unitType: id } });
    const selectedRoles = roleIds ? roleIds.split(',').filter(id => id) : [];
    if (+unitType === id && selectedRoles.length) {
      this.fetchRolePermissions(selectedRoles);
      setFieldsValue({ roleIds: selectedRoles });
    }
    else {
      setFieldsValue({ roleIds: [] });
      this.clearRolePermissions(id);
    }
  };

  // 单位类型下拉框选择
  handleUnitTypeSelect = value => {
    const {
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;
    // 清除所属单位、所属部门
    setFieldsValue({ unitId: undefined, departmentId: undefined });
    // 根据当前选中的单位类型获取对应的所属单位列表
    fetchUnitsFuzzy({
      payload: {
        unitType: value,
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
  };

  // 所属单位下拉框输入
  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    // 根据输入值获取列表
    if (getFieldValue('unitType')) {
      fetchUnitsFuzzy({
        payload: {
          unitType: getFieldValue('unitType'),
          unitName: value && value.trim(),
          pageNum: 1,
          pageSize: defaultPageSize,
        },
      });
    }
    // 清除数据权限输入框的值
    setFieldsValue({
      treeIds: undefined,
      departmentId: undefined,
    });
  };

  // 所属单位下拉框选择
  handleDataPermissions = value => {
    const {
      fetchDepartmentList,
      form: { setFieldsValue, resetFields },
    } = this.props;
    const { unitTypeChecked } = this.state;

    // 根据value从源数组中筛选出对应的数据，获取其值
    setFieldsValue({
      treeIds: value,
    });
    fetchDepartmentList({
      payload: {
        companyId: value.key,
      },
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
    unitTypeChecked === 1 &&
      this.getMaintenanceTree({
        payload: { companyId: value.key },
      });
  };

  handleUnitSelect = ({ value, label }) => {
    const {
      fetchDepartmentList,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      treeIds: { key: value, label },
    });
    fetchDepartmentList({
      payload: {
        companyId: value,
      },
    });
  };

  /** 所属单位下拉框失焦 */
  handleUnitIdBlur = value => {
    const {
      fetchUnitsFuzzy,
      account: { unitIdes },
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    // 根据value判断是否是手动输入
    if (value && value.key === value.label) {
      this.handleUnitIdChange.cancel();
      // 从源数组中筛选出当前值对应的数据，如果存在，则将对应的数据为所属单位下拉框重新赋值
      const unitId = unitIdes.filter(item => item.name === value.label)[0];
      if (unitId) {
        const treeIds = {
          key: unitId.id,
          label: unitId.name,
        };
        setFieldsValue({
          unitId: treeIds,
          treeIds,
        });
      } else {
        setFieldsValue({
          unitId: undefined,
          treeIds: undefined,
        });
        if (getFieldValue('unitType')) {
          fetchUnitsFuzzy({
            payload: {
              unitType: getFieldValue('unitType'),
              pageNum: 1,
              pageSize: defaultPageSize,
            },
          });
        }
      }
    }
  };

  handleFetchDepartments = item => {
    const { fetchDepartmentList } = this.props;
    fetchDepartmentList({
      payload: {
        companyId: item.key,
      },
    });
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
            unitType,
            accountStatus,
            userType,
            unitId,
            unitName,
            documentTypeId,
            execCertificateCode,
            departmentId,
            // regulatoryClassification,
          },
        },
        unitTypes,
        accountStatuses,
        unitIdes,
        userTypes,
        gavUserTypes,
        documentTypeIds,
        departments,
      },
      form: { getFieldDecorator },
      match: {
        params: { id, userId },
      },
      loading,
    } = this.props;

    const { unitTypeChecked } = this.state;

    const treeList = treeData(departments);

    return (
      <Card title="账号基本信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  initialValue: loginName,
                })(<Input disabled={true} placeholder="请输入用户名" min={1} max={20} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
                  initialValue: accountStatus,
                })(
                  <AutoComplete disabled={true} placeholder="请选择账号状态">
                    {accountStatuses.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.userName}>
                {getFieldDecorator('userName', {
                  initialValue: userName,
                })(<Input disabled={true} placeholder="请输入姓名" min={1} max={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.phoneNumber}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入手机号',
                    },
                  ],
                })(<Input disabled={true} placeholder="请输入手机号" min={11} max={11} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  initialValue: userId
                    ? unitType
                    : unitTypes && unitTypes.length === 0
                      ? undefined
                      : unitTypes[0].id,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位类型',
                    },
                  ],
                })(
                  <Select
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
            {unitTypeChecked !== 2 && (
              <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                <Form.Item label={fieldLabels.unitId}>
                  {getFieldDecorator('unitId', {
                    initialValue:
                      userId && unitId && unitName ? { key: unitId, label: unitName } : undefined,
                    rules: [
                      {
                        required: unitTypeChecked !== 3, // 如果是运营企业 不需要必填,
                        transform: value => value && value.label,
                        message: '请选择所属单位',
                      },
                    ],
                  })(
                    <AutoComplete
                      mode="combobox"
                      labelInValue
                      optionLabelProp="children"
                      placeholder="请选择所属单位"
                      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                      onSearch={this.handleUnitIdChange}
                      onSelect={this.handleDataPermissions}
                      // onChange={this.handleFetchDepartments}
                      onBlur={this.handleUnitIdBlur}
                      filterOption={false}
                    >
                      {unitIdes.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </AutoComplete>
                  )}
                </Form.Item>
              </Col>
            )}
            {/* 单位类型为政府时的所属单位 */}
            {unitTypeChecked === 2 && (
              <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                <Form.Item label={fieldLabels.unitId}>
                  {getFieldDecorator('unitId', {
                    initialValue:
                      userId && unitId && unitName ? { value: unitId, label: unitName } : undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择所属单位',
                      },
                    ],
                  })(
                    <TreeSelect
                      allowClear
                      placeholder="请选择所属单位"
                      labelInValue
                      onSelect={this.handleUnitSelect}
                    >
                      {generateTressNode(unitIdes)}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
            )}
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.departmentId}>
                {getFieldDecorator('departmentId', {
                  initialValue: userId ? departmentId : null,
                })(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    placeholder="请选择所属部门"
                  >
                    {treeList}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            {/* 当单位类型为企事业主体（企事业主体对应id为4） */}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 4 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.userType}>
                    {getFieldDecorator('userType', {
                      initialValue: userId
                        ? userType
                        : userTypes.length === 0
                          ? undefined
                          : userTypes[0].value,
                      rules: [
                        {
                          required: true,
                          message: '请选择用户角色',
                        },
                      ],
                    })(
                      <AutoComplete placeholder="请选择用户角色">
                        {userTypes.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        ))}
                      </AutoComplete>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 4 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.regulatoryClassification}>
                    {getFieldDecorator('regulatoryClassification', {
                      initialValue: SUPERVISIONS_ALL,
                      rules: [{ required: true, message: '请选择业务分类' }],
                    })(
                      <Select mode="multiple" placeholder="请选择业务分类">
                        {Supervisions.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
            {/* 当单位类型为政府机构（政府机构对应id为2） */}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 2 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.userType}>
                    {getFieldDecorator('userType', {
                      initialValue: userType,
                      rules: [
                        {
                          required: true,
                          message: '请选择用户角色',
                        },
                      ],
                    })(
                      <AutoComplete placeholder="请选择用户角色">
                        {gavUserTypes.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.label}
                          </Option>
                        ))}
                      </AutoComplete>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 2 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.regulatoryClassification}>
                    {getFieldDecorator('regulatoryClassification', {
                      initialValue: SUPERVISIONS_ALL,
                      rules: [{ required: true, message: '请选择业务分类' }],
                    })(
                      <Select mode="multiple" placeholder="请选择业务分类">
                        {Supervisions.map(item => (
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
              unitTypeChecked === 2 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.documentTypeId}>
                    {getFieldDecorator('documentTypeId', {
                      initialValue: documentTypeId,
                    })(
                      <AutoComplete allowClear placeholder="请选择执法证种类">
                        {documentTypeIds.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        ))}
                      </AutoComplete>
                    )}
                  </Form.Item>
                </Col>
              )}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 2 && (
                <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
                  <Form.Item label={fieldLabels.execCertificateCode}>
                    {getFieldDecorator('execCertificateCode', {
                      initialValue: execCertificateCode,
                    })(<Input placeholder="请输入执法证编号" />)}
                  </Form.Item>
                </Col>
              )}
          </Row>
        </Form>
      </Card>
    );
  }

  // 勾选服务单位
  onSerCheck = serCheckedKeys => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list = [] },
        maintenanceSerTree,
        maintenanceSubTree,
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
        maintenanceSubTree = [],
      },
    } = this.props;
    const subKeys = maintenanceSubTree.map(item => item.key);
    const isCheckAllSer = maintenanceSerTree.length === 0 || getFieldValue('isCheckAllSer');
    const isCheckAllSub = this.isAContentsB(subCheckedKeys, subKeys);
    const isCheckAll = isCheckAllSer && isCheckAllSub;
    let fields = { subCheckedKeys, isCheckAll, isCheckAllSub };
    maintenanceSerTree.length > 0 && Object.assign(fields, { isCheckAllSer });
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? list[0].key : undefined });
  };

  // 展开分公司及服务单位
  onSubExpand = subExpandedKeys => {
    this.setState({
      subExpandedKeys,
    });
  };

  // 数据权限服务单位搜索
  onSerTreeSearch = (value, tree) => {
    this.setState({
      searchSerValue: value,
    });
  };

  isAContentsB = (a, b) => {
    for (const item of b) {
      if (!a.includes(item)) return false;
    }
    return true;
  };

  // 数据权限子公司及服务单位搜索
  onSubTreeSearch = (value, tree) => {
    const subExpandedKeys = getParentKeys(tree, value);

    this.setState({
      subExpandedKeys,
      searchSubValue: value,
    });
  };

  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    console.log(nextTargetKeys);
    setFieldsValue({ roleIds: nextTargetKeys });

    this.fetchRolePermissions(nextTargetKeys);

    // // 穿梭框中有值
    // if (nextTargetKeys.length)
    //   this.fetchRolePermissions(nextTargetKeys);
    // // 穿梭框中没有值时，不需要请求服务器，本地清空即可
    // else
    //   this.clearRolePermissions();
  };

  clearRolePermissions = unitType => {
    const { dispatch, form: { setFieldsValue } } = this.props;
    const isNotAdmin = unitType !== 3;

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

  fetchRolePermissions = ids => {
    const { dispatch } = this.props;
    const { unitTypeChecked } = this.state;
    const isNotAdmin = unitTypeChecked !== 3;

    // ids不为数组或者ids的长度为0，则本地清空
    if (!Array.isArray(ids) || !ids.length)
      this.clearRolePermissions(unitTypeChecked);
    else
      dispatch({
        type: 'role/fetchRolePermissions',
        payload: { id: ids.join(',') },
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
    const isloaded = !loadingEffects['role/fetchAppPermissionTree'] && !loadingEffects['role/fetchDetail'];
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
      // 如果分公司没有数据,默认成全选
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
      // 如果没有服务单位数据，分公司就是全选状态
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

  /* 渲染角色权限信息 */
  renderRolePermission() {
    const {
      dispatch,
      role,
      account: {
        detail: {
          data: { treeNames, treeIds, roleIds },
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

    const roleList = roles.map(({ id, name }) => ({ key: id, title: name }));
    return (
      <Card title="系统角色权限配置" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col span={24}>
              <Form.Item label={fieldLabels.roleIds}>
                {getFieldDecorator('roleIds', {
                  initialValue: roleIds ? roleIds.split(',') : [],
                  valuePropName: 'targetKeys',
                  rules: [
                    {
                      required: true,
                      transform: value => value && value.join(','),
                      message: '请配置角色',
                    },
                  ],
                })(
                  <Transfer
                    dataSource={roleList}
                    titles={['可选角色', '已选角色']}
                    render={item => item.title}
                    onChange={this.handleTransferChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="WEB账号权限">
                <AuthorityTree
                  role={role}
                  form={form}
                  dispatch={dispatch}
                  setIdMaps={this.setIdMaps}
                  setPermissions={this.setPermissions}
                  handleChangeAuthTreeCheckedKeys={this.handleChangeAuthTreeCheckedKeys}
                />
              </Form.Item>
            </Col>
            {(unitTypeChecked === 1 || unitTypeChecked === 2 || unitTypeChecked === 4) && (
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="APP账号权限">
                  <AppAuthorityTree
                    role={role}
                    form={form}
                    dispatch={dispatch}
                    treeType={UNIT_TYPE_FIX[unitTypeChecked]}
                    setIdMaps={this.setAppIdMaps}
                    setPermissions={this.setAppPermissions}
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
          {unitTypeChecked === 1 && treeList.length > 0 ? (
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
      </Card>
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

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading, authorityTreeLoading, appAuthorityTreeLoading } = this.props;
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          onClick={this.handleClickValidate}
          loading={loading || submitting || authorityTreeLoading || appAuthorityTreeLoading}
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
      authorityTreeLoading,
      appAuthorityTreeLoading,
      match: { params: { userId } },
    } = this.props;
    const { submitting } = this.state;
    const title = userId ? editTitle : addTitle;
    const content = (
      <div>
        <p>一个账号关联多家单位</p>
      </div>
    );

    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
      },
      {
        title: '权限管理',
        name: '权限管理',
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
        <Spin spinning={loading || submitting || authorityTreeLoading || appAuthorityTreeLoading}>
          {this.renderBasicInfo()}
          {this.renderRolePermission()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
