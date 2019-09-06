import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Divider, Popconfirm, Button, Modal, Input, message, Select, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { AuthButton, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const title = '型号管理'

const formItemCol = {
  labelCol: {
    span: 6,
    offset: 2,
  },
  wrapperCol: {
    span: 13,
  },
};
// 设备类型配置
const deviceTypes = [
  { key: 1, label: '数据处理设备' },
  { key: 2, label: '网关设备' },
  { key: 3, label: '监测对象' },
  { key: 4, label: '传感器' },
]

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

// 渲染新增/编辑弹窗
const RenderModal = Form.create()(props => {
  const {
    form: { validateFields, getFieldDecorator, getFieldValue },
    detail,
    visible,
    onOk,
    onCancel,
    monitoringType, // 监测类型列表树
    fetchAllDeviceTypes,
    deviceTypeList, // 设备类型列表
    currentType: type,
    saveState,
  } = props
  const isEdit = detail && detail.id
  const handleConfirm = () => {
    validateFields((err, values) => {
      if (err) return
      onOk(values)
    })
  }
  // const type = getFieldValue('type')
  const onTypeSelect = (type) => {
    [1, 2, 3].includes(+type) && fetchAllDeviceTypes({ payload: { type } })
    saveState({ currentType: type })
  }

  /*
    说明
      1、设备类型分类选择传感器，可选择监测类型
      2、如果选择了其他，可选择分类下的设备类型
  */
  return (
    <Modal width={600} title={isEdit ? '编辑型号' : '新增型号'} visible={visible} onOk={handleConfirm} onCancel={onCancel} destroyOnClose>
      <Form>
        <FormItem {...formItemCol} label="型号名称：">
          {getFieldDecorator('name', {
            initialValue: isEdit ? detail.name : undefined,
            rules: [{ required: true, message: '请输入型号名称' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem {...formItemCol} label="设备类型分类：">
          {getFieldDecorator('type', {
            initialValue: isEdit ? detail.type : undefined,
            rules: [{ required: true, message: '请选择设备类型分类' }],
          })(
            <Select placeholder="请选择" onSelect={onTypeSelect}>
              {deviceTypes.map(({ key, label }) => (
                <Select.Option key={key} value={key}>{label}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        {[1, 2, 3].includes(type) && (
          <FormItem {...formItemCol} label="设备类型：">
            {getFieldDecorator('equipmentType', {
              initialValue: isEdit ? detail.equipmentType : undefined,
              rules: [{ required: true, message: '请选择设备类型' }],
            })(
              <Select placeholder="请选择">
                {deviceTypeList.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        {type === 4 && (
          <FormItem {...formItemCol} label="监测类型：">
            {getFieldDecorator('monitorType', {
              initialValue: isEdit ? detail.monitorType : undefined,
              rules: [{ required: true, message: '请选择监测类型' }],
            })(
              <TreeSelect
                placeholder="请选择"
                dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                allowClear
              >
                {renderTreeNodes(monitoringType)}
              </TreeSelect>
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  )
})

@connect(({ user, device, loading }) => ({
  user,
  device,
  tableLoading: loading.effects['device/fetchModelsForPage'],
}))
export default class ModelList extends PureComponent {

  state = {
    detail: null, // 型号信息
    modalVisible: false,  // 编辑/新增弹窗可见
    currentType: undefined,
  }

  componentDidMount() {
    this.handleQuery()
    this.fetchMonitoringTypes()
  }


  /**
   * 获取监测类型列表树
   */
  fetchMonitoringTypes = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringTypes' })
  }

  /**
  * 获取设备类型列表
  */
  fetchAllDeviceTypes = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchAllDeviceTypes',
      ...actions,
    })
  }

  /**
   * 搜索型号列表
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      match: { params: { brandId } },
    } = this.props
    dispatch({
      type: 'device/fetchModelsForPage',
      payload: { pageNum, pageSize, brand: brandId },
    })
  }


  /**
   * 点击打开编辑弹窗
   */
  handleViewEdit = (detail) => {
    this.setState({ detail, modalVisible: true, currentType: detail.type })
  }


  /**
   * 点击打开新增弹窗
   */
  handleViewAdd = () => {
    this.setState({ detail: null, modalVisible: true, currentType: undefined })
  }


  /**
   * 关闭弹窗
   */
  handleCLoseModal = () => {
    this.setState({ modalVisible: false, detail: null })
  }


  /**
   * 新增/编辑操作
   */
  handleModalConfirm = (values) => {
    const {
      dispatch,
      match: { params: { brandId: brand } },
    } = this.props
    const { detail } = this.state
    const tag = detail && detail.id ? '编辑' : '新增'
    const success = () => {
      message.success(`型号${tag}成功`)
      this.setState({ modalVisible: false, detail: null })
      this.handleQuery()
    }
    const error = (res) => { message.error(res ? res.msg : `型号${tag}失败`) }
    // 如果编辑
    if (detail && detail.id) {
      dispatch({
        type: 'device/editModel',
        payload: { ...values, brand, id: detail.id },
        success,
        error,
      })
    } else {
      // 新增
      dispatch({
        type: 'device/addModel',
        payload: { ...values, brand },
        success,
        error,
      })
    }
  }

  /**
 * 删除型号
 */
  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/deleteModel',
      payload: { id },
      success: () => {
        message.success('型号删除成功')
        this.setState({ modalVisible: false })
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '型号删除失败') },
    })
  }

  saveState = (newState) => {
    this.setState({ ...newState })
  }

  /**
   * 渲染型号列表
   */
  renderTable = () => {
    const {
      tableLoading,
      device: {
        model: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '型号名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '设备类型分类',
        dataIndex: 'type',
        align: 'center',
        width: 300,
        render: (val) => val ? deviceTypes[+val - 1].label : null,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <AuthA code={codes.deviceManagement.brand.edit} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该监测类型吗？" onConfirm={() => this.handleDelete(row.id)}>
              <AuthA code={codes.deviceManagement.brand.delete}>删除</AuthA>
            </Popconfirm>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
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
        monitoringType,
        model: {
          pagination: { total = 0 },
        },
        deviceType: { list: deviceTypeList },
      },
    } = this.props
    const { detail, modalVisible, currentType } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '品牌管理', name: '品牌管理', href: '/device-management/brand/list' },
      { title, name: title },
    ]
    const modalProps = {
      detail,
      visible: modalVisible,
      onOk: this.handleModalConfirm,
      onCancel: this.handleCLoseModal,
      monitoringType,
      fetchAllDeviceTypes: this.fetchAllDeviceTypes,
      deviceTypeList,
      saveState: this.saveState,
      currentType,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`型号总数：${total}`}
        extraContent={
          (<Button type="primary" onClick={this.handleViewAdd}>新增</Button>)
        }
      >
        {this.renderTable()}
        <RenderModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
