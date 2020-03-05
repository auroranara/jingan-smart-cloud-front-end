import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Table, Divider, Popconfirm, Button, Modal, Input, message, Row, Col } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { AuthA, AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';
import router from 'umi/router';

const FormItem = Form.Item;

const title = '型号报警阈值设置'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联设备管理', name: '物联设备管理' },
  { title, name: title },
]
const formItemCol = {
  labelCol: {
    span: 5,
    offset: 2,
  },
  wrapperCol: {
    span: 15,
  },
};
const {
  deviceManagement: {
    brand: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      model: {
        listView: modelViewCode,
      },
    },
  },
} = codes
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

const RenderModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields },
    detail,
    visible,
    onOk,
    onCancel,
  } = props
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) return
      onOk(values)
    })
  }
  return (
    <Modal title={detail ? '编辑品牌' : '新增品牌'} visible={visible} onOk={handleOk} onCancel={onCancel} destroyOnClose >
      <Form>
        <FormItem {...formItemCol} label="品牌名称：">
          {getFieldDecorator('name', {
            initialValue: detail && detail.id ? detail.name : undefined,
            rules: [{ required: true, message: '请输入品牌名称' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ device, user, loading }) => ({
  device,
  user,
  loading: loading.effects['device/fetchBrandsForPage'],
}))
export default class Brand extends PureComponent {

  state = {
    modalVisible: false, // 新增（编辑）弹窗可见
    detail: null,  // 品牌信息
  }

  componentDidMount() {
    this.handleQuery()
  }

  /**
   * 搜索品牌列表
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props
    const formValues = getFieldsValue()
    dispatch({
      type: 'device/fetchBrandsForPage',
      payload: { pageNum, pageSize, ...formValues },
    })
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 删除操作
   */
  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/deleteBrand',
      payload: { id },
      success: () => {
        message.success('品牌删除成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res.msg) },
    })
  }


  /**
   * 打开编辑品牌弹窗
   */
  handleViewEdit = (detail) => {
    this.setState({ modalVisible: true, detail })
  }


  /**
   * 打开新增品牌弹窗
   */
  handleViewAdd = () => {
    this.setState({ modalVisible: true, detail: null })
  }


  /**
   * 新增/编辑弹窗确认
   */
  handleConfirmModal = (values) => {
    const { dispatch } = this.props
    const { detail } = this.state
    const success = () => {
      message.success(detail && detail.id ? '品牌编辑成功' : '品牌新增成功')
      this.setState({ modalVisible: false })
      this.handleQuery()
    }
    const error = (res) => { message.error(res.msg) }
    // 如果编辑
    if (detail && detail.id) {
      dispatch({
        type: 'device/editBrand',
        payload: { ...values, id: detail.id },
        success,
        error,
      })
    } else {
      // 新增
      dispatch({
        type: 'device/addBrand',
        payload: { ...values },
        success,
        error,
      })
    }
  }


  /**
   * 关闭弹窗
   */
  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  jumpToModel = (brandId) => {
    router.push(`/device-management/brand/${brandId}/model`)
  }

  /**
   * 渲染品牌列表
   */
  renderBrandTable = () => {
    const {
      loading,
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
            <AuthA code={editCode} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该品牌吗？" onConfirm={() => this.handleDelete(row.id)}>
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
            <Divider type="vertical" />
            <AuthA
              code={modelViewCode}
              onClick={() => this.jumpToModel(row.id)}>
              型号管理
               </AuthA>
          </Fragment>
        ),
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

  /**
 * 筛选栏
 */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
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
                <Button onClick={() => this.handleQuery()} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleViewAdd}>新增</AuthButton>
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
        brand: {
          pagination: { total = 0 },
        },
      },
    } = this.props
    const { detail, modalVisible } = this.state
    const modalProps = {
      visible: modalVisible,
      detail,
      onOk: this.handleConfirmModal,
      onCancel: this.handleCloseModal,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`品牌总数：${total}`}
      >
        {this.renderFilter()}
        {this.renderBrandTable()}
        <RenderModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
