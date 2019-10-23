import { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Table, Input, TreeSelect, message, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const { TreeNode, SHOW_PARENT } = TreeSelect;

const title = '设备类型';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
];
const tabList = [
  {
    key: '1',
    tab: '数据处理设备',
  },
  {
    key: '2',
    tab: '网关设备',
  },
  {
    key: '3',
    tab: '监测对象',
  },
]
const noAuth = (content) => <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>{content}</span>
const formItemCol = {
  labelCol: {
    span: 5,
    offset: 2,
  },
  wrapperCol: {
    span: 15,
  },
};

/* 渲染树节点 */
const renderTreeNodes = data => {
  return data.map(item => {
    const { id, name, child } = item;
    if (child) {
      return (
        <TreeNode title={name} key={id} value={id}>
          {renderTreeNodes(child)}
        </TreeNode>
      );
    }
    return <TreeNode title={name} key={id} value={id} />;
  });
};

const RenderModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields },
    title,
    visible,
    detail,
    monitoringType, // 监测类型树
    onOk,
    onCancel,
    tagList,
  } = props
  const handleConfirm = () => {
    validateFields((err, values) => {
      if (err) return
      onOk(values)
    })
  }
  return (
    <Modal title={title} visible={visible} onOk={handleConfirm} onCancel={onCancel} destroyOnClose>
      <Form>
        <FormItem {...formItemCol} label="设备类型名称：">
          {getFieldDecorator('name', {
            initialValue: detail ? detail.name : undefined,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem {...formItemCol} label="监测类型">
          {getFieldDecorator('monitorTypeList', {
            initialValue: detail ? detail.monitorTypeList : undefined,
          })(
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
            >
              {renderTreeNodes(monitoringType)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemCol} label="图标选择：">
          {getFieldDecorator('logoId', {
            initialValue: detail ? detail.logoId : undefined,
          })(
            <Select placeholder="请选择">
              {tagList.map(({ id, name, webUrl }) => (
                <Select.Option
                  key={id}
                  value={id}
                >
                  <img style={{ objectFit: 'contain' }} width="27" height="27" src={webUrl} alt="图标"></img>
                  <span style={{ paddingLeft: '1em' }}>{name}</span>
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

@connect(({ user, device, loading }) => ({
  user,
  device,
  loading: loading.effects['device/fetchDeviceTypes'],
}))
export default class DeviceType extends PureComponent {

  state = {
    activeTabKey: tabList[0].key, // 当前页头tab
    modalVisible: false, // 配置监测类型弹窗可见
    detail: null,
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.handleQuery()
    // 获取监测类型树
    dispatch({ type: 'device/fetchMonitoringTypeTree' })
    this.fetchAllTags()
  }

  handleQuery = (pageNum = 1, pageSize = 10) => {
    const { activeTabKey: type } = this.state
    this.fetchDeviceTypes({
      payload: { pageNum, pageSize, type },
    })
  }

  /**
  * 获取全部图标
  */
  fetchAllTags = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchAllTags', payload: {} })
  }

  /**
   * 获取设备类型列表
   */
  fetchDeviceTypes = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchDeviceTypes',
      ...actions,
    })
  }


  /**
   * 页头tab变化
   */
  onTabChange = (activeTabKey) => {
    this.setState({ activeTabKey }, () => {
      this.handleQuery()
    })
  }


  /**
   * 点击提交监测类型
   */
  handleEdit = (values) => {
    const { dispatch } = this.props
    const { activeTabKey, detail } = this.state
    dispatch({
      type: 'device/deployMonitoringType',
      payload: { ...values, type: activeTabKey, id: detail.id },
      success: () => {
        message.success('配置监测类型成功')
        this.setState({ modalVisible: false })
        this.handleQuery()
      },
      error: (response) => { message.error(response.msg) },
    })
  }

  handleClose = () => {
    this.setState({ modalVisible: false })
  }

  handleViewDeploy = (detail) => {
    this.setState({ detail, modalVisible: true })
  }

  /**
   * 渲染列表
   */
  renderTable = () => {
    const {
      loading,
      device: {
        deviceType: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const { activeTabKey } = this.state
    const editAuth = hasAuthority(codes.deviceManagement.deviceType.edit, permissionCodes)
    const columns = [
      {
        title: '设备类型名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => +activeTabKey !== 2 && editAuth ? (
          <a onClick={() => this.handleViewDeploy(row)}>配置监测类型</a>
        ) : noAuth('配置监测类型'),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={loading}
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
            bordered
          />
        ) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    );
  }

  render() {
    const {
      device: {
        // 监测类型树
        monitoringType = [],
        // 设备类型
        deviceType: {
          pagination: { total = 0 },
        },
        tagLibrary: { list: tagList },
      },
    } = this.props
    const { activeTabKey, modalVisible, detail } = this.state
    const content = (
      <span>
        设备类型总数：{total || 0}
      </span>
    )
    const modalProps = {
      title: '配置监测类型',
      visible: modalVisible,
      detail,
      monitoringType,
      onOk: this.handleEdit,
      onCancel: this.handleClose,
      tagList,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={content}
        activeTabKey={activeTabKey}
        tabList={tabList}
        onTabChange={this.onTabChange}
      >
        {this.renderTable()}
        <RenderModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
