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
  Transfer,
  AutoComplete,
  Checkbox,
} from 'antd';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import AuthorityTree from './AuthorityTree';
import {
  renderSearchedTreeNodes,
  getParentKeys,
  getTreeListChildrenMap,
  handleMtcTreeViolently as handleMtcTree,
  mergeArrays,
  getNoRepeat,
  addParentKey,
  removeParentKey,
} from './utils';
import styles from './AccountManagementEdit.less';

const { Option } = Select;

// 编辑页面标题
const editTitle = '编辑账号';
// 添加页面标题
const addTitle = '新增账号';
// 返回地址
const href = '/role-authorization/account-management/list';

const TreeNode = TreeSelect.TreeNode;
const { Search } = Input;

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
  userType: '用户类型',
  documentTypeId: '执法证种类',
  execCertificateCode: '执法证编号',
  regulatoryClassification: '业务分类',
};

// 单位类型对应的id
// 企事业主体：4
// 运营企业：3
// 政府机构：2
// 维保企业：1

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

const generateUnitsTree = data => {
  return data.map(item => {
    if (item.child && item.child.length) {
      return (
        <TreeNode title={item.name} key={item.id} value={item.id}>
          {generateUnitsTree(item.child)}
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
    loading: loading.models.account,
    authorityTreeLoading: loading.effects['role/fetchPermissionTree'],
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
    fetchRoles() {
      dispatch({
        type: 'account/fetchRoles',
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

    // 获取用户类型
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
export default class accountManagementEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  state = {
    unitTypeChecked: false,
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
      match: {
        params: { id },
      },
      fetchOptions,
      goToException,
      fetchUnitsFuzzy,
      clearDetail,
      fetchRoles,
      fetchExecCertificateType,
      fetchUserType,
      // fetchDepartmentList,
    } = this.props;

    const success = id
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

    // 如果id存在的话，就获取详情，即编辑状态
    if (id) {
      // 获取详情
      fetchAccountDetail({
        payload: {
          id,
        },
        success: ({ unitType, unitId }) => {
          this.setState(
            {
              unitTypeChecked: unitType,
            },
            () => {
              // 若为维保单位，则获取维保权限树
              // unitType === 1 && this.getMaintenanceTree(unitId);
            }
          );

          // 获取单位类型成功以后根据第一个单位类型获取对应的所属单位列表
          // fetchUnitsFuzzy({
          //   payload: {
          //     unitType: unitType,
          //     pageNum: 1,
          //     pageSize: defaultPageSize,
          //   },
          // });
          // if (unitId) {
          //   fetchDepartmentList({
          //     payload: {
          //       companyId: unitId,
          //     },
          //     error: goToException,
          //   });
          // }
        },
        error: () => {
          goToException();
        },
      });
    } else {
      clearDetail();
      // 获取角色列表
      fetchRoles({
        error: goToException,
      });
      // 获取执法证件种类
      fetchExecCertificateType({
        error: goToException,
      });
      // 获取用户类型
      fetchUserType({
        error: goToException,
      });
    }

    // 获取单位类型和账户状态
    fetchOptions({
      success,
    });
  }

  // sortMap = {};
  // totalMap = {};
  childrenMap = {};
  idMap = {};
  parentIdMap = {};
  permissions = [];
  authTreeCheckedKeys = [];

  setIdMaps = idMaps => {
    [this.parentIdMap, this.idMap] = idMaps;
  };

  //获取维保权限树
  getMaintenanceTree = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchMaintenanceTree',
      payload: { companyId },
      callback: ({ list: treeList = [] }) => {
        // this.sortMap = getSortMap(treeList);
        // this.totalMap = getTotalMap(treeList);
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
      // account: { maintenanceTree: { list: treeList=[] } },
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
          // maintenacePermissions,
          password,
          roleIds,
          departmentId,
          userType,
          documentTypeId,
          execCertificateCode,
          regulatoryClassification,
          permissions,
          serCheckedKeys = [],
          subCheckedKeys = [],
          isCheckAll,
        }
      ) => {
        // console.log(maintenacePermissions, this.sortMap, this.totalMap);
        // const sorted = Array.from(maintenacePermissions).sort((k1, k2) => this.sortMap[k1] - this.sortMap[k2]);
        // console.log(sorted);

        // console.log(maintenacePermissions, this.chidrenMap);
        // console.log(handleMtcTree(maintenacePermissions, this.childrenMap));

        // console.log(getNoRepeat(permissions, this.permissions));
        // console.log(addParentKey(getNoRepeat(permissions, this.permissions), this.parentIdMap));

        if (!error) {
          this.setState({
            submitting: true,
          });

          const success = () => {
            const msg = id ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, goBack);
          };
          const error = err => {
            message.error(err, 1);
            this.setState({
              submitting: false,
            });
          };
          // 数据权限所有选中的key值
          const checkedKeys = [...serCheckedKeys, ...subCheckedKeys]
          const maintenacePermissions = handleMtcTree(checkedKeys, this.childrenMap)
          // 如果id存在的话，为编辑
          if (id) {
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
          } else {
            // console.log('maintenacePermissions',maintenacePermissions)
            const payload = {
              id,
              loginName,
              password: password && password.trim(),
              accountStatus,
              userName,
              phoneNumber,
              unitType,
              unitId: unitId ? (unitTypeChecked === 2 ? unitId.value : unitId.key) : null,
              treeIds: treeIds ? treeIds.key : null,
              maintenacePermissions: isCheckAll ? [checkedRootKey] : maintenacePermissions,
              roleIds: roleIds.join(','),
              departmentId: Array.isArray(departmentId) ? undefined : departmentId,
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
            };
            switch (payload.unitType) {
              // 维保企业
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
            addAccount({
              payload,
              success,
              error,
            });
          }
        }
      }
    );
  };

  // 单位类型下拉框中的值发生改变时调用
  handleUnitTypesChange = id => {
    // console.log('change');

    // 非combox模式下，即单选时Select的onChange, onSelect几乎一样，只需要用一个即可，所以将下面的onSelect函数合并上来
    // 不同的地方在于，再次选择时，若选择了和上次一样的选项，则会出发onselect，但是由于Select框的值并未发生改变，所以不会触发onchange事件
    this.handleUnitTypeSelect(id);
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState(
      {
        unitTypeChecked: id,
      },
      () => {
        if (id === 4) {
          setFieldsValue({ userType: 'company_legal_person' });
        } else {
          setFieldsValue({ userType: undefined });
        }

        if (id === 4 || id === 2) setFieldsValue({ regulatoryClassification: SUPERVISIONS_ALL });
      }
    );
  };

  // 单位类型下拉框选择
  handleUnitTypeSelect = value => {
    // console.log('select');
    const {
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;
    // 清除所属单位、所属部门
    setFieldsValue({ unitId: undefined });
    setFieldsValue({ departmentId: undefined });
    // 根据当前选中的单位类型获取对应的所属单位列表
    if (value === 2) {
      fetchUnitsFuzzy({
        payload: {
          unitType: value,
        },
      });
    } else {
      fetchUnitsFuzzy({
        payload: {
          unitType: value,
          pageNum: 1,
          pageSize: defaultPageSize,
        },
      });
    }
  };

  // 所属单位下拉框输入
  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    // 根据输入值获取列表
    fetchUnitsFuzzy({
      payload: {
        unitType: getFieldValue('unitType'),
        unitName: value && value.trim(),
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
    // 清除数据权限输入框的值
    setFieldsValue({
      treeIds: undefined,
      departmentId: undefined,
    });
  };

  // 所属单位下拉框选择
  handleDataPermissions = value => {
    // console.log('value', value);

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
    })
    resetFields(['serCheckedKeys', 'subCheckedKeys', 'isCheckAll', 'isCheckAllSub', 'isCheckAllSer'])
    // 只有类型是维保单位的时候才请求维保树
    // console.log(unitTypeChecked);
    unitTypeChecked === 1 && this.getMaintenanceTree(value.key);
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
        fetchUnitsFuzzy({
          payload: {
            unitType: getFieldValue('unitType'),
            pageNum: 1,
            pageSize: defaultPageSize,
          },
        });
      }
    }
  };

  /* handleFetchDepartments = item => {
    const { fetchDepartmentList } = this.props;
    fetchDepartmentList({
      payload: {
        companyId: item.key,
      },
    });
  }; */

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
      account: {
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
    } = this.props
    const serCheckedKeys = isCheckAll ? maintenanceSerTree.map(item => item.key) : []
    const subCheckedKeys = isCheckAll ? maintenanceSubTree.map(item => item.key) : []
    const isCheckAllSub = isCheckAll, isCheckAllSer = isCheckAll
    let fields = { isCheckAll }
    maintenanceSerTree.length > 0 && Object.assign(fields, { isCheckAllSer, serCheckedKeys })
    maintenanceSubTree.length > 0 && Object.assign(fields, { isCheckAllSub, subCheckedKeys })
    setFieldsValue(fields)
    this.setState({ checkedRootKey: isCheckAll ? checkedRootKey : undefined })
  }

  /* 监听勾选全部服务单位 */
  handleCheckAllSer = e => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list: treeList = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
    } = this.props
    const checked = e.target.checked
    if (checked) {
      const isCheckAllSub = maintenanceSubTree.length === 0 || getFieldValue('isCheckAllSub')
      // 服务单位第一层keys
      const serCheckedKeys = maintenanceSerTree.map(item => item.key)
      // 如果分公司没有数据，服务单位就是全选状态
      setFieldsValue({ isCheckAll: maintenanceSubTree.length === 0 || isCheckAllSub, serCheckedKeys })
      this.setState({ checkedRootKey: isCheckAllSub ? treeList[0].key : undefined })
    } else {
      setFieldsValue({ isCheckAll: false, serCheckedKeys: [] })
      this.setState({ checkedRootKey: undefined })
    }
  }

  /* 监听勾选全部分公司 */
  handleCheckAllSub = e => {
    const {
      form: { setFieldsValue, getFieldValue },
      account: {
        maintenanceTree: { list: treeList = [] },
        maintenanceSerTree = [],
        maintenanceSubTree = [],
      },
    } = this.props
    const checked = e.target.checked
    if (checked) {
      const isCheckAllSer = maintenanceSerTree.length === 0 || getFieldValue('isCheckAllSer')
      // 分公司第一次层keys
      const subCheckedKeys = maintenanceSubTree.map(item => item.key)
      setFieldsValue({ isCheckAll: maintenanceSerTree.length === 0 || isCheckAllSer, subCheckedKeys })
      this.setState({ checkedRootKey: isCheckAllSer ? treeList[0].key : undefined })
    } else {
      setFieldsValue({ isCheckAll: false, subCheckedKeys: [] })
      this.setState({ checkedRootKey: undefined })
    }
  }

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
        params: { id },
      },
      loading,
    } = this.props;

    const { unitTypeChecked } = this.state;

    const isValidateLoginName = id ? [] : [{ validator: this.validateUserName }];

    const treeList = treeData(departments);

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
                })(
                  id ? (
                    <span>{loginName}</span>
                  ) : (
                      <Input placeholder="请输入用户名" min={1} max={20} />
                    )
                )}
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
            <Col lg={8} md={12} sm={24} >
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
                    initialValue: id
                      ? unitType
                      : unitTypes.length === 0
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
                      // onSelect={this.handleUnitTypeSelect}
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
              unitTypeChecked !== 2 && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.unitId} className={styles.hasUnit}>
                    {getFieldDecorator('unitId', {
                      initialValue:
                        unitId && unitName ? { key: unitId, label: unitName } : undefined,
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

            {!id &&
              unitTypeChecked === 2 && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.unitId}>
                    {getFieldDecorator('unitId', {
                      // TODO：
                      initialValue:
                        unitId && unitName ? { value: unitId, label: unitName } : undefined,
                      rules: [
                        {
                          required: true, // 如果是运营企业 不需要必填,
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
                        {generateUnitsTree(unitIdes)}
                      </TreeSelect>
                    )}
                  </Form.Item>
                </Col>
              )}

            {!id && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.departmentId}>
                  {getFieldDecorator('departmentId', {
                    initialValue: [departmentId],
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
            )}
            {/* 当单位类型为企事业主体（企事业主体对应id为4） */}
            {unitTypes.length !== 0 &&
              unitTypeChecked === 4 &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.userType}>
                    {getFieldDecorator('userType', {
                      initialValue: id
                        ? userType
                        : userTypes.length === 0
                          ? undefined
                          : userTypes[0].value,
                      rules: [
                        {
                          required: true,
                          message: '请选择用户类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择用户类型">
                        {userTypes.map(item => (
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
              unitTypeChecked === 4 &&
              !id && (
                <Col lg={8} md={12} sm={24}>
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
              unitTypeChecked === 2 &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.userType}>
                    {getFieldDecorator('userType', {
                      initialValue: userType,
                      rules: [
                        {
                          required: true,
                          message: '请选择用户类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择用户类型">
                        {gavUserTypes.map(item => (
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
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.regulatoryClassification}>
                    {getFieldDecorator('regulatoryClassification', {
                      // initialValue:
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
              unitTypeChecked === 2 &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.documentTypeId}>
                    {getFieldDecorator('documentTypeId', {
                      initialValue: documentTypeId,
                      // rules: [
                      //   {
                      //     message: '请选择执法证种类',
                      //   },
                      // ],
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
              unitTypeChecked === 2 &&
              !id && (
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.execCertificateCode}>
                    {getFieldDecorator('execCertificateCode', {
                      initialValue: execCertificateCode,
                      rules: [
                        {
                          message: '请输入执法证编号',
                        },
                      ],
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
        maintenanceSerTree = [], // 服务单位公司列表
        maintenanceSubTree = [],   // 分公司列表
      },
    } = this.props;
    // 因为服务单位理论上没有children，所以判断length
    const isCheckAllSer = maintenanceSerTree.length === serCheckedKeys.length
    // 如果分公司无数据，默认当作全选状态
    const isCheckAllSub = maintenanceSubTree.length === 0 || getFieldValue('isCheckAllSub')
    const isCheckAll = isCheckAllSer && isCheckAllSub
    let fields = { serCheckedKeys, isCheckAll, isCheckAllSer }
    maintenanceSubTree.length > 0 && Object.assign(fields, { isCheckAllSub })
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? list[0].key : undefined })
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
    const subKeys = maintenanceSubTree.map(item => item.key)
    const isCheckAllSer = getFieldValue('isCheckAllSer')
    const isCheckAllSub = this.isAContentsB(subCheckedKeys, subKeys)
    const isCheckAll = isCheckAllSer && isCheckAllSub
    let fields = { subCheckedKeys, isCheckAll, isCheckAllSub }
    maintenanceSerTree.length > 0 && Object.assign(fields, { isCheckAllSer })
    setFieldsValue(fields);
    this.setState({ checkedRootKey: isCheckAll ? list[0].key : undefined })
  };

  isAContentsB = (a, b) => {
    for (const item of b) {
      if (!a.includes(item)) return false
    }
    return true
  }

  // 展开分公司及服务单位
  onSubExpand = subExpandedKeys => {
    this.setState({
      subExpandedKeys,
    });
  }

  // 判断两个字符串数组内容是否一样
  isArrContentSame = (first, second) => {
    return first.sort().join(',') === second.sort().join(',')
  }

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
  }

  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    // console.log(nextTargetKeys);
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ roleIds: nextTargetKeys });

    // 穿梭框中有值
    if (nextTargetKeys.length)
      dispatch({
        type: 'role/fetchRolePermissions',
        payload: { id: nextTargetKeys.join(',') },
        success: permissions => {
          this.permissions = permissions;
          setFieldsValue({
            permissions: removeParentKey(
              mergeArrays(permissions, this.authTreeCheckedKeys),
              this.idMap
            ),
          });
        },
      });
    // 穿梭框中没有值时，不需要请求服务器，本地清空即可
    else {
      this.permissions = [];
      setFieldsValue({ permissions: this.authTreeCheckedKeys });
      dispatch({ type: 'role/saveRolePermissions', payload: [] });
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
      <Card title="角色权限配置" className={styles.card} bordered={false}>
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="账号权限">
                <AuthorityTree
                  role={role}
                  form={form}
                  dispatch={dispatch}
                  setIdMaps={this.setIdMaps}
                  handleChangeAuthTreeCheckedKeys={checkedKeys => {
                    this.authTreeCheckedKeys = checkedKeys;
                  }}
                />
              </Form.Item>
            </Col>
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
          {/* {unitTypeChecked === 1 && treeList.length ? (
            <Row gutter={{ lg: 48, md: 24 }}>
              <Col lg={8} md={12} sm={24}>
                <p className={styles.mTree}>维保权限</p>
                <Search placeholder="请输入单位名称查询" onChange={this.onTreeSearch} />
                <Form.Item>
                  {getFieldDecorator('maintenacePermissions', {
                    // initialValue: maintenacePermissions,
                    valuePropName: 'checkedKeys',
                  })(
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                    // checkedKeys={this.state.checkedKeys}
                    // onSelect={this.onSelect}
                    // selectedKeys={this.state.selectedKeys}
                    >
                      {renderSearchedTreeNodes(treeList, searchValue)}
                    </Tree>
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : null} */}
          {unitTypeChecked === 1 && treeList.length > 0 ? (
            <Row gutter={{ lg: 48, md: 24 }}>
              <Col lg={8} md={12} sm={24}>
                <p className={styles.dpTitle}>维保权限</p>
                <div className={styles.dpContent}>
                  <div className={styles.line}>
                    <span>本单位：{treeList[0].title}</span>
                    {getFieldDecorator('isCheckAll', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox onChange={e => this.handleCheckAll(e.target.checked, treeList[0].key)}>全选</Checkbox>
                    )}
                  </div>
                  <div className={styles.line}>
                    <span>本单位的服务单位：</span>
                    {maintenanceSerTree.length > 0 && getFieldDecorator('isCheckAllSer', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox onChange={this.handleCheckAllSer}>全选</Checkbox>
                    )}
                    {maintenanceSerTree.length > 0 ? (
                      <Fragment>
                        <Search placeholder="请输入单位名称查询" onChange={e => this.onSerTreeSearch(e.target.value, maintenanceSerTree)} />
                        {getFieldDecorator('serCheckedKeys', {
                          valuePropName: 'checkedKeys',
                        })(
                          <Tree
                            checkable
                            onCheck={this.onSerCheck}
                          >
                            {renderSearchedTreeNodes(maintenanceSerTree, searchSerValue)}
                          </Tree>
                        )}
                      </Fragment>
                    ) : (<span>暂无数据</span>)}
                  </div>
                  <div className={styles.line}>
                    <span>分公司及其服务单位：</span>
                    {maintenanceSubTree.length > 0 && getFieldDecorator('isCheckAllSub', {
                      valuePropName: 'checked',
                    })(
                      <Checkbox onChange={this.handleCheckAllSub}>全选</Checkbox>
                    )}
                    {maintenanceSubTree.length > 0 ? (
                      <Fragment>
                        <Search placeholder="请输入单位名称查询" onChange={e => this.onSubTreeSearch(e.target.value, maintenanceSubTree)} />
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
                    ) : (<span>暂无数据</span>)}
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
    const { loading } = this.props;
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          onClick={this.handleClickValidate}
          loading={loading || submitting}
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
    const { submitting } = this.state;
    const title = id ? editTitle : addTitle;
    const content = (
      <div>
        <p>
          {id
            ? '编辑单个账号的基本信息，角色权限、数据权限'
            : '创建单个账号，包括基本信息、角色权限等'}
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
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {!id && this.renderRolePermission()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
