import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Input, TreeSelect, Form, Card, Row, Col } from 'antd';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

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

@Form.create()
@connect(({ device, loading }) => ({
  device,
  brandLoading: loading.effects['device/fetchBrandsForPage'],
  modelLoading: loading.effects['device/fetchModelsForPage'],
}))
export default class BrandModelModal extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      modelVisible: false, // 型号弹窗可见
      brandId: undefined,
      brandName: undefined,
      expandedTree: [],// 展开后的监测类型列表
    }
  }

  // componentDidMount() {

  // }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return prevProps.visible !== this.props.visible
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.handleQueryBrands()
      this.setState({ modelVisible: false })
      this.fetchMonitoringTypes()
    }
  }

  /**
   * 搜索品牌列表
   */
  handleQueryBrands = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
      equipmentType,
    } = this.props
    const { brandName: name, brandMonitorType: monitorType } = getFieldsValue()
    dispatch({
      type: 'device/fetchBrandsForPage',
      payload: { pageNum, pageSize, type: 4, name, monitorType, equipmentType },
    })
  }

  /**
   * 搜索型号列表
   */
  handleQueryModels = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
      equipmentType,
    } = this.props
    const { brandId } = this.state
    const { modelName: name, modelMonitorType: monitorType } = getFieldsValue()
    dispatch({
      type: 'device/fetchModelsForPage',
      payload: { pageNum, pageSize, brand: brandId, type: 4, name, monitorType, equipmentType },
    })
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
   * 查看品牌下型号列表
   */
  hanldeViewModels = ({ id, name }) => {
    this.setState({ brandId: id, brandName: name, modelVisible: true }, () => {
      this.handleQueryModels()
    })
  }

  /**
   * 选择型号
   */
  handleSelectModel = model => {
    const { onSelectModel } = this.props
    const { brandId, brandName } = this.state
    const monitorType = model.monitorType
    this.setState({ modelVisible: false }, () => {
      onSelectModel({
        model: { id: model.id, name: model.name },
        brand: { id: brandId, name: brandName },
        monitorType,
      })
    })
  }


  /**
   * 清空品牌筛选栏
   */
  handleResetBrand = () => {
    const { form: { resetFields } } = this.props
    resetFields(['brandName', 'brandMonitorType'])
    this.handleQueryBrands()
  }

  /**
   * 清空型号筛选栏
   */
  handleResetModel = () => {
    const { form: { resetFields } } = this.props
    resetFields(['modelName', 'modelMonitorType'])
    this.handleQueryModels()
  }

  /**
   * 渲染品牌列表
   */
  renderBrandTable = () => {
    const {
      brandLoading,
      device: {
        brand: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
    } = this.props
    const columns = [
      {
        title: '品牌名称',
        dataIndex: 'name',
        align: 'center',
        width: '70%',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.hanldeViewModels(row)}>型号列表</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Table
        rowKey="id"
        columns={columns}
        loading={brandLoading}
        dataSource={list}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          onChange: this.handleQueryBrands,
          onShowSizeChange: (num, size) => {
            this.handleQueryBrands(1, size);
          },
        }}
        bordered
      />
    )
  }

  /**
   * 渲染品牌筛选
   * @param {string} type type 两个值：'brand' | 'model'
   */
  renderFilter = (type = 'brand') => {
    const {
      form: { getFieldDecorator },
      device: {
        monitoringType, // 监测类型列表树
      },
    } = this.props
    return (
      <Card style={{ marginBottom: '20px' }}>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator(type === 'brand' ? 'brandMonitorType' : 'modelMonitorType')(
                  <TreeSelect
                    placeholder="监测类型"
                    dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                    allowClear
                  >
                    {renderTreeNodes(monitoringType)}
                  </TreeSelect>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator(type === 'brand' ? 'brandName' : 'modelName')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button onClick={() => { type === 'brand' ? this.handleQueryBrands() : this.handleQueryModels() }} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={type === 'brand' ? this.handleResetBrand : this.handleResetModel}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
   * 选择型号弹窗
   */
  renderModelModal = () => {
    const {
      modelLoading,
      device: {
        model: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
        // deviceTypeOptions,
      },
    } = this.props
    const { modelVisible, expandedTree } = this.state
    const columns = [
      {
        title: '型号名称',
        dataIndex: 'name',
        align: 'center',
      },
      // {
      //   title: '设备类型分类',
      //   dataIndex: 'type',
      //   align: 'center',
      //   width: 200,
      //   render: (val) => val ? deviceTypeOptions[+val - 1].label : null,
      // },
      {
        title: '监测类型',
        dataIndex: 'monitorType',
        align: 'center',
        width: 200,
        render: (val) => {
          const target = expandedTree.find(item => item.id === val) || {}
          return target.name || ''
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.handleSelectModel(row)}>选择</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Modal
        title="选择型号"
        visible={modelVisible}
        footer={null}
        width={800}
        onCancel={() => { this.setState({ modelVisible: false }) }}
      >
        {this.renderFilter('model')}
        <Table
          loading={modelLoading}
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
            onChange: this.handleQueryModels,
            onShowSizeChange: (num, size) => {
              this.handleQueryModels(1, size);
            },
          }}
          bordered
        />
      </Modal>
    )
  }

  render() {
    const {
      visible,
      onCancel,
    } = this.props

    return (
      <Modal
        title="选择品牌"
        visible={visible}
        onCancel={onCancel}
        width={800}
        destroyOnClose
        footer={null}
      >
        {this.renderFilter('brand')}
        {this.renderBrandTable()}
        {this.renderModelModal()}
      </Modal>
    )
  }
}
