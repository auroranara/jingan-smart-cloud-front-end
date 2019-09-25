import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Divider, Popconfirm, Button, Modal, Input, message, Select, TreeSelect, Row, Col } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';
import Link from 'umi/link';

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
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
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
// 展开列表树
const expandTree = (list) => {
  if (!list || list.length === 0) return []
  let arr = []
  let temp = []
  temp = [...list]
  while (temp.length) {
    const { child, ...res } = temp.shift()
    arr.push(res)
    if (child && child.length) {
      temp = [...temp, ...child]
    }
  }
  return arr
}

// 渲染新增/编辑弹窗
const RenderModal = Form.create()(props => {
  const {
    form: { validateFields, getFieldDecorator, setFieldsValue },
    detail,
    visible,
    onOk,
    onCancel,
    monitoringType, // 监测类型列表树
    fetchAllDeviceTypes,
    deviceTypeList, // 设备类型列表
    currentType: type,
    saveState,
    deviceTypeOptions,
    monitoringTypeDict,
    allModelCodeList,
    fetchAllUnsetModelList,
  } = props
  const isEdit = detail && !!detail.id
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
  /**
 * 数据类型改变
 */
  const handleDataTypeChange = (type) => {
    // 获取数据编码
    fetchAllUnsetModelList({ payload: { type } })
    setFieldsValue({ dataCode: undefined })
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
            // type 1 数据处理设备 2 网关设备 3 监测对象 4  传感器
            initialValue: isEdit ? detail.type : undefined,
            rules: [{ required: true, message: '请选择设备类型分类' }],
          })(
            <Select placeholder="请选择" onSelect={onTypeSelect} disabled={isEdit}>
              {deviceTypeOptions.map(({ key, label }) => (
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
          <Fragment>
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
            <FormItem label="数据类型" {...formItemCol}>
              {getFieldDecorator('dataType', {
                initialValue: isEdit ? detail.dataType : undefined,
                rules: [{ required: true, message: '请选择数据类型' }],
              })(
                <Select placeholder="请选择" onChange={handleDataTypeChange} allowClear>
                  {monitoringTypeDict.map(({ key, value }) => (
                    <Select.Option key={key} value={key}>{key}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="数据编码" {...formItemCol}>
              {getFieldDecorator('dataCode', {
                initialValue: isEdit ? detail.dataCode : undefined,
                rules: [{ required: true, message: '请选择数据编码' }],
              })(
                <Select placeholder="请选择">
                  {allModelCodeList.map(({ model }) => (
                    <Select.Option key={model} value={model}>{model}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Fragment>
        )}
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ user, device, sensor, loading }) => ({
  user,
  device,
  sensor,
  tableLoading: loading.effects['device/fetchModelsForPage'],
}))
export default class ModelList extends PureComponent {

  state = {
    detail: null, // 型号信息
    modalVisible: false,  // 编辑/新增弹窗可见
    currentType: undefined,
    expandedTree: [], // 展开后的监测类型列表
  }

  componentDidMount() {
    this.handleQuery()
    this.fetchMonitoringTypes()
    this.fetchMonitoringTypeDict()
  }


  /**
   * 获取监测类型列表树
   */
  fetchMonitoringTypes = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchMonitoringTypes',
      callback: (list) => {
        const expandedTree = expandTree(list)
        this.setState({ expandedTree })
      },
    })
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
      form: { getFieldsValue },
    } = this.props
    const formValues = getFieldsValue()
    dispatch({
      type: 'device/fetchModelsForPage',
      payload: { pageNum, pageSize, brand: brandId, ...formValues },
    })
  }

  /**
   * 重置筛选
   */
  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }

  /**
    * 获取数据编码列表
    */
  fetchAllUnsetModelList = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchAllUnsetModelList',
      ...actions,
    })
  }


  /**
 * 获取数据类型
 */
  fetchMonitoringTypeDict = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchMonitoringTypeDict',
      ...actions,
    })
  }

  /**
   * 点击打开编辑弹窗
   */
  handleViewEdit = (detail) => {
    const type = detail.type
    this.setState({ detail, modalVisible: true, currentType: type })
    type && this.fetchAllUnsetModelList({ payload: { type } })
  }


  /**
   * 点击打开新增弹窗
   */
  handleViewAdd = () => {
    const { dispatch } = this.props
    this.setState({ detail: null, modalVisible: true, currentType: undefined })
    dispatch({
      type: 'sensor/saveState',
      payload: { value: [], key: 'allModelCodeList' },
    })
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

  jumpToParameter = () => { }

  /**
   * 渲染型号列表
   */
  renderTable = () => {
    const {
      tableLoading,
      match: { params: { brandId } },
      device: {
        deviceTypeOptions, // 参数分组类型数组
        monitoringType, // 监测类型列表树
        model: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const { expandedTree } = this.state
    // 跳转到配置参数页面
    const parameterAuth = hasAuthority(codes.deviceManagement.brand.model.deployParameter, permissionCodes)
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
        render: (val, row) => {
          const type = val ? deviceTypeOptions[+val - 1].label : null
          // 如果不是传感器
          if (+val !== 4) {
            return type
          }
          const target = expandedTree.find(item => item.id === row.monitorType) || {}
          return `（${target.name}）${type}`
        },
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
            {row.type === 4 && parameterAuth && (<Divider type="vertical" />)}
            {row.type === 4 && parameterAuth && (
              <Link to={`/device-management/brand/${brandId}/model/${row.id}/parameter`}>配置参数</Link>
            )}
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


  /**
   * 筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      device: {
        deviceTypeOptions,
      },
    } = this.props
    return (
      <Card style={{ marginBottom: '20px' }}>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="设备类型">
                    {deviceTypeOptions.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button onClick={() => this.handleQuery()} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <Button type="primary" onClick={this.handleViewAdd}>新增</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
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
        deviceTypeOptions,
      },
      sensor: {
        monitoringTypeDict = [], // 监测类型字典
        allModelCodeList = [], // 传感器型号字典
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
      deviceTypeOptions,
      monitoringTypeDict,
      allModelCodeList,
      fetchAllUnsetModelList: this.fetchAllUnsetModelList,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`型号总数：${total}`}
      >
        {this.renderFilter()}
        {this.renderTable()}
        <RenderModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
