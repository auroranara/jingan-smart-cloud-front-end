import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Checkbox, Form, Card, Input, Button, Select, Spin, Table, Tabs, Tree, TreeSelect, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './Role.less';
import { hasAuthority } from '@/utils/customAuth';
import { GOV, OPE, checkParent, generateTreeNode, sortTree, uncheckParent, getUnitDisabled, getIdMap, getNewMsgs, addParentId, removeParentId } from './utils';

const { TreeNode } = Tree;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const PAGE_SIZE = 20;
const INLINE_FORM_STYLE = { width: '50%', marginRight: 0 };
const addTitle = '新增角色';
const editTitle = '编辑角色';

@Form.create()
export default class RoleHandler extends PureComponent {
  state = {
    modalVisible: false,
    submitting: false,
    unitType: undefined,
    msgs: {},
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      type,
      companyId,
      match: { params: { id } },
      form: { setFieldsValue },
      fetchUnits,
      fetchUnitTypes,
      fetchDetail,
      fetchPermissionTree,
      clearPermissionTree,
      clearDetail,
      user: { currentUser: { unitType, unitName } },
    } = this.props;

    const isPublic = type;
    const isAdmin = !companyId;
    if (!type && fetchUnits)
      this.lazyFetchUnits = _.debounce(fetchUnits, 300);

    this.clearModel();
    fetchUnitTypes();

    if (id) { // 编辑
      fetchDetail({
        payload: { id },
        success: detail => {
          const { unitType, companyId, companyName } = detail || {};
          if (unitType === undefined || unitType === null)
            return;

          fetchPermissionTree({
            payload: isAdmin ? unitType : companyId,
            callbackLater: (webTree, appTree, msgTree) => this.handleMsgTree(msgTree, true),
          });

          companyName && this.fetchInitUnits(unitType, companyName);
          companyId && setFieldsValue({ companyId });

          this.setState({ unitType: +unitType });
          this.setInitMsgs();
        },
      });
    } else if(!isPublic && !isAdmin){ // 新增,私有角色,非运营
      clearDetail();
      fetchPermissionTree({
        payload: companyId,
        callbackLater: (webTree, appTree, msgTree) => this.handleMsgTree(msgTree, true),
      });
      this.fetchInitUnits(unitType, unitName);
      setFieldsValue({ unitType, companyId });
      this.setState({ unitType: +unitType });
    } else {
      clearDetail();
      clearPermissionTree();
    }
  }

  clearModel() {
    const { clearDetail, clearPermissionTree } = this.props;
    clearDetail();
    clearPermissionTree();
  }

  idMap = {};

  handleMsgTree = (list, initial) => {
    this.idMap = getIdMap(list);
    if (initial)
      this.setInitMsgs();
    else
      this.setState({ msgs: {} });
  };

  setInitMsgs = () => {
    const { role: { detail, msgPermissionTree } } = this.props;
    const { messagePermissionIds } = detail || {};
    const msgIds = messagePermissionIds || [];
    // loading.effects靠不住，不是接口返回就认为loading变化了，貌似是整个异步函数都调用完成才会改变loading，如callback调用时，也会认为还没完成
    if (msgIds.length && msgPermissionTree.length) { // 考察modals里的具体变量是否已经有了更靠谱
      const handledMsgIds = removeParentId(msgIds, this.idMap);
      this.setState({ msgs: handledMsgIds.reduce((prev, next) => { prev[next] = true; return prev; }, {}) });
    }
  };

  genHandleCheck = id => e => {
    const { msgs } = this.state;
    const newMsgs = getNewMsgs(id, msgs, this.idMap);
    this.setState({ msgs: newMsgs });
  };

  // 企业用户时，角色类型和单位名称是固定不能更改的，所以不会触发这个函数，只有管理员或运营才会触发这个函数
  handleTypeChange = value => {
    const {
      fetchPermissionTree,
      form: { setFieldsValue },
      role: {
        detail: {
          unitType,
          webPermissionIds,
          appPermissionIds,
        },
      },
    } = this.props;

    setFieldsValue({ companyId: undefined });
    this.setState({ unitType: +value });

    this.fetchInitUnits(value);
    fetchPermissionTree({
      payload: value,
      // 在model变化前，先清空值，不然会报warning
      callback: () => { setFieldsValue({ permissions: undefined, appPermissions: undefined }); },
      // model变化后再设置值，不然当先设置值时，就会报warning，且model后变化，就没办法正确设置上值了
      callbackLater: (tree, appTree, msgTree) => {
        let initial = false;
        if (+value === +unitType) {
          initial = true;
          const value = webPermissionIds ? uncheckParent(tree, webPermissionIds) : [];
          const appValue = appPermissionIds ? uncheckParent(appTree, appPermissionIds) : [];
          setFieldsValue({ permissions: value, appPermissions: appValue  });
        }
        this.handleMsgTree(msgTree, initial);
      },
    });
  };

  fetchInitUnits = (unitType, unitName) => {
    const { fetchUnits } = this.props;
    let payload;
    if (+unitType === GOV)
      payload= { unitType };
    else
      payload = { unitType, unitName, pageNum: 1, pageSize: PAGE_SIZE };
      fetchUnits && fetchUnits({ payload });
  };

  /* 提交 */
  handleSubmit = () => {
    const {
      companyId: compyId,
      insertRole,
      updateRole,
      goBack,
      form: { validateFieldsAndScroll },
      match: { params: { id } },
    } = this.props;

    // 验证表单
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // 验证成功后显示加载动画以确保无法重复点击
        this.setState({
          submitting: true,
        });
        const {
          role: { permissionTree, appPermissionTree },
        } = this.props;
        const { msgs } = this.state;
        const msgIds = Object.entries(msgs).reduce((prev, next) => {
          const [id, checked] = next;
          if (checked)
            prev.push(id);
          return prev;
        }, []);
        const { roleName, description, permissions, appPermissions, unitType, companyId } = values;

        const payload = {
          id,
          companyId: companyId || compyId,
          unitType,
          roleName: roleName.trim(),
          description,
          webPermissionIds: checkParent(permissionTree, permissions),
          appPermissionIds: checkParent(appPermissionTree, appPermissions),
          messagePermissionIds: addParentId(msgIds, this.idMap),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, goBack);
        };
        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在，则编辑角色
        if (id)
          updateRole({ payload, success, error });
        // 否则新增角色
        else
          insertRole({ payload, success, error });
      }
    });
  };

  handleUnitValueChange = value => {
    const { unitType } = this.state;
    this.lazyFetchUnits({ payload: { unitType, unitName: value, pageNum: 1, pageSize: PAGE_SIZE } });
  };

  /* 基本信息 */
  renderBasicInfo() {
    const {
      type,
      companyId,
      unitsLoading,
      match: { params: { id } },
      account: { unitTypes },
      role: {
        unitList,
        detail: { roleName, description, unitType },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { unitType: unitTypeSelected } = this.state;

    const sortedUnitTypes = unitTypes ? Array.from(unitTypes) : [];
    sortedUnitTypes.sort((u1, u2) => u1.sort - u2.sort);

    let unit;
    const isEdit = !!id;
    const isPublic = type; // 是否是渲染公共角色
    const isAdmin = !companyId;
    const isOperate = unitTypeSelected === OPE; // 选择类型是否是运营类型
    const isGovernment = unitTypeSelected === GOV; // 选择类型是否是政府类型
    const notOperateAndNotPublic = !isOperate && !isPublic; // 私有角色下且选择类型为非运营
    const disabled = getUnitDisabled(isEdit, isPublic, isAdmin); // 1.私有角色编辑 2.新增,私有角色,非管理员  true
    if (!isPublic) // 私有角色下才有选择单位
      unit = isGovernment ? (
        <TreeSelect
          allowClear
          disabled={disabled}
          placeholder="请选择所属单位"
        >
          {generateTreeNode(unitList)}
        </TreeSelect>
      ) : (
        <Select
          showSearch
          disabled={disabled}
          placeholder="请选择所属单位"
          notFoundContent={unitsLoading ? <Spin size="small" /> : '暂无数据'}
          onSearch={this.handleUnitValueChange}
          filterOption={false}
        >
          {unitList.map(item => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      );

    return (
      <Card title="基本信息">
        <Form>
          <Form.Item
            label="角色单位类型"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 6 },
              lg: { span: 3 },
            }}
          >
            {getFieldDecorator('unitType', {
              initialValue: unitType ? +unitType : unitType,
              rules: [{ required: true, message: '请选择角色单位类型' }],
            })(
              <Select
                disabled={disabled}
                onChange={this.handleTypeChange}
              >
                {sortedUnitTypes.map(({ id, label }, i) => <Option key={id} value={id}>{label}</Option>)}
              </Select>
            )}
          </Form.Item>
          {notOperateAndNotPublic && (
            <Form.Item
              label="角色所属单位"
              labelCol={{
                sm: { span: 24 },
                md: { span: 3 },
                lg: { span: 3 },
              }}
              wrapperCol={{
                sm: { span: 24 },
                md: { span: 21 },
                lg: { span: 9 },
              }}
            >
              {getFieldDecorator('companyId', {
                rules: [{ required: true, message: '请选择角色所属单位' }],
              })(unit)}
            </Form.Item>
          )}
          <Form.Item
            label="角色名称"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 21 },
              lg: { span: 9 },
            }}
          >
            {getFieldDecorator('roleName', {
              initialValue: roleName,
              rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
            })(<Input maxLength={50} placeholder="请输入角色名称" />)}
          </Form.Item>
          <Form.Item
            label="角色描述"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 21 },
              lg: { span: 17 },
            }}
          >
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: true, message: '请输入角色描述', whitespace: true }],
            })(<TextArea rows={4} maxLength="500" placeholder="请输入角色描述" />)}
          </Form.Item>
        </Form>
      </Card>
    );
  }

  /* 树节点 */
  renderTreeNodes(data) {
    return data.map(item => {
      const { id, showZname: title, childMenus: children } = item;
      if (children) {
        return (
          <TreeNode title={title} key={id} dataRef={item} selectable={false}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={id} dataRef={item} selectable={false} />;
    });
  }

  /* 权限配置 */
  renderAuthorizationConfiguration() {
    const {
      role: {
        permissionTree,
        appPermissionTree,
        detail: { appPermissionIds, webPermissionIds },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { unitType } = this.state;

    const value = webPermissionIds ? uncheckParent(permissionTree, webPermissionIds) : [];
    const appValue = appPermissionIds ? uncheckParent(appPermissionTree, appPermissionIds) : [];
    const tree = sortTree(permissionTree);
    const appTree = sortTree(appPermissionTree);

    return (
      <TabPane tab="权限配置" key="1" className={styles.tabPane}>
        <Form layout="inline">
          <Form.Item
            label="WEB权限树"
            style={INLINE_FORM_STYLE}
            labelCol={{
              sm: { span: 24 },
              md: { span: 6 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 18 },
            }}
          >
            {getFieldDecorator('permissions', {
              initialValue: value,
              trigger: 'onCheck',
              validateTrigger: 'onCheck',
              valuePropName: 'checkedKeys',
            })(<Tree checkable>{this.renderTreeNodes(tree)}</Tree>)}
          </Form.Item>
          {unitType !== OPE && (
            <Form.Item
              label="APP权限树"
              style={INLINE_FORM_STYLE}
              labelCol={{
                sm: { span: 24 },
                md: { span: 6 },
              }}
              wrapperCol={{
                sm: { span: 24 },
                md: { span: 18 },
              }}
            >
              {getFieldDecorator('appPermissions', {
                initialValue: appValue,
                trigger: 'onCheck',
                validateTrigger: 'onCheck',
                valuePropName: 'checkedKeys',
              })(<Tree checkable>{this.renderTreeNodes(appTree)}</Tree>)}
            </Form.Item>
          )}
        </Form>
        {this.renderButtonGroup()}
      </TabPane>
    );
  }

  renderMessageSubscription() {
    const { role: { msgPermissionTree } } = this.props;
    const { msgs } = this.state;
    const columns = [
      { title: '消息类别', dataIndex: 'name', key: 'name' },
      { title: '消息示例', dataIndex: 'example', key: 'example',
        render: txt => {
          return txt ? txt.split('\n').map((t, i) => <p key={i} className={styles.example}>{t}</p>) : txt;
        },
      },
      { title: '推荐接收人', dataIndex: 'accepter', key: 'accepter' },
      { title: '是否配置', dataIndex: 'check', key: 'check', align: 'center',
        render: (txt, record) => (
          <Checkbox checked={msgs[record.id]} onChange={this.genHandleCheck(record.id)} />
        ),
      },
    ];

    return (
      <TabPane tab="消息订阅配置" key="2" className={styles.tabPane1}>
        <Table
          rowKey="id"
          className={styles.table}
          columns={columns}
          dataSource={msgPermissionTree}
          pagination={false}
        />
        {this.renderButtonGroup()}
      </TabPane>
    );
  }

  /* 按钮组 */
  renderButtonGroup() {
    const {
      goBack,
      loading,
      codes: { list: listCode },
      user: { currentUser: { permissionCodes } },
    } = this.props;
    const hasListAuthority = hasAuthority(listCode, permissionCodes);

    return (
      <div style={{ textAlign: 'center' }}>
        <Button onClick={goBack} style={{ marginRight: '24px' }} disabled={!hasListAuthority}>
          返回
        </Button>
        <Button type="primary" onClick={this.handleSubmit} loading={loading}>
          确定
        </Button>
      </div>
    );
  }

  render() {
    const {
      loading,
      type,
      urls: { listUrl },
      codes: { list: listCode },
      match: { params: { id } },
      user: { currentUser: { permissionCodes } },
    } = this.props;
    const { submitting } = this.state;

    const typeLabel = type ? '公共' : '用户';
    const hasListAuthority = hasAuthority(listCode, permissionCodes); // 是否有列表权限
    const title = id ? editTitle : addTitle; // 根据params.id是否存在判断当前为新增还是编辑
    const breadcrumbList = [ // 面包屑
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '角色权限',
        name: '角色权限',
      },
      {
        title: `${typeLabel}角色`,
        name: `${typeLabel}角色`,
        href: hasListAuthority ? listUrl : undefined,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          <Tabs className={styles.tabs}>
            {this.renderAuthorizationConfiguration()}
            {this.renderMessageSubscription()}
          </Tabs>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
