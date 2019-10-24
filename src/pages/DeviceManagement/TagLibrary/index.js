import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Divider,
  Popconfirm,
  Button,
  Modal,
  Input,
  message,
  Upload,
  Icon,
  Row,
  Col,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Lightbox from 'react-images';
import { AuthButton, AuthA } from '@/utils/customAuth';
import { getToken } from '@/utils/authority';
import codes from '@/utils/codes';

const FormItem = Form.Item;

const title = '图标库'
const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';
const FOLDER = 'monitor';
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

const formItemCol = {
  labelCol: {
    span: 5,
    offset: 2,
  },
  wrapperCol: {
    span: 15,
  },
};

const uploadButton = loading => (
  <div>
    <Icon type={loading ? 'loading' : 'plus'} />
    <div>上传</div>
  </div>
);
const RenderModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    detail,
    visible,
    onCancel,
    onOk,
    imageUrl,
    uploading,
    saveState,
  } = props
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) return
      onOk(values)
    })
  }
  const handleUploadChange = info => {
    const { file } = info;
    if (file.status === 'uploading') {
      saveState({ uploading: true })
    }
    if (file.status === 'done' && file.response && file.response.code === 200) {
      const { webUrl, dbUrl } = file.response.data.list[0]
      saveState({ uploading: false, imageUrl: webUrl })
      setFieldsValue({ dbUrl })
    }
    if (file.status === 'error') {
      message.error('上传失败')
      saveState({ uploading: false })
    }
  }
  return (
    <Modal title={detail && detail.id ? '编辑图标' : '新增图标'} visible={visible} onOk={handleOk} onCancel={onCancel} destroyOnClose >
      <Form>
        <FormItem {...formItemCol} label="名称：">
          {getFieldDecorator('name', {
            initialValue: detail ? detail.name : undefined,
            rules: [{ required: true, message: '请输入名称' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        {visible && (
          <FormItem {...formItemCol} label="图片：">
            {getFieldDecorator('dbUrl', {
              initialValue: detail ? detail.dbUrl : undefined,
              rules: [{ required: true, message: '请上传图标' }],
            })(
              <Fragment>
                <Upload
                  name="files"
                  action={UPLOAD_ACTION}
                  data={{ folder: FOLDER }}
                  listType="picture-card"
                  showUploadList={false}
                  onChange={handleUploadChange}
                  headers={{ 'JA-Token': getToken() }}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton(uploading)}
                </Upload>
              </Fragment>
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ user, device, loading }) => ({
  user,
  device,
  tableLoading: loading.effects['device/fetchTagsForPage'],
}))
export default class TagLibrary extends PureComponent {

  state = {
    modalVisible: false, // 新增/编辑图标弹窗可见
    detail: null,  // 图标信息
    imageUrl: null, // 新增编辑图片展示地址
    uploading: false, // 上传图标加载状态
    showUrl: null, // 查看大图图片地址
  }

  componentDidMount() {
    this.handleQuery()
  }

  /**
   * 搜索图标库列表
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchTagsForPage',
      payload: { pageNum, pageSize, ...values },
    })
  }

  /**
   * 打开编辑弹窗
   */
  handleViewEdit = (detail) => {
    this.setState({ detail, modalVisible: true, imageUrl: detail.webUrl || undefined })
  }


  /**
   * 打开新增弹窗
   */
  handleViewAdd = () => {
    this.setState({ detail: null, modalVisible: true, imageUrl: undefined })
  }


  /**
   * 删除图标库
   */
  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/deleteTag',
      payload: { id },
      success: () => {
        message.success('图标删除成功')
        this.setState({ modalVisible: false })
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '图标删除失败') },
    })
  }


  /**
   * 关闭弹窗
   */
  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  saveState = (state) => {
    this.setState({ ...state })
  }

  /**
   * 编辑/新增弹窗确认
   */
  handleConformModal = (values) => {
    const { dispatch } = this.props
    const { detail } = this.state
    const tag = detail && detail.id ? '编辑' : '新增'
    const success = () => {
      message.success(`图标${tag}成功`)
      this.setState({ modalVisible: false })
      this.handleQuery()
    }
    const error = (res) => { message.error(res ? res.msg : `图标${tag}失败`) }
    // 如果编辑
    if (detail && detail.id) {
      dispatch({
        type: 'device/editTag',
        payload: { ...values, id: detail.id },
        success,
        error,
      })
    } else {
      dispatch({
        type: 'device/addTag',
        payload: { ...values },
        success,
        error,
      })
    }
  }

  handleCloseImage = () => {
    this.setState({ showUrl: null })
  }

  /**
   * 图片详情
   */
  renderImageDetail = () => {
    const { showUrl } = this.state;
    if (showUrl) {
      const list = /(.jpg|.png)$/.test(showUrl) ? [{ src: showUrl }] : []
      if (list.length > 0) {
        return (
          <Lightbox
            images={list}
            isOpen={true}
            currentImage={0}
            onClose={this.handleCloseImage}
          />
        );
      }
    } else return null;
  }


  /**
   * 点击重置列表数据
   */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
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
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
   * 渲染图标列表
   */
  renderTable = () => {
    const {
      tableLoading,
      device: {
        tagLibrary: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '图标名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'webUrl',
        align: 'center',
        width: 250,
        render: (val) => val ? (
          <img
            style={{ width: 40, height: 40, cursor: 'pointer', objectFit: 'contain' }}
            src={val}
            alt=""
            onClick={() => {
              this.setState({ showUrl: val, currentImage: 0 });
            }}
          />
        ) : (
            <span style={{ display: 'inline-block', width: 30, height: 40 }} />
          ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 250,
        render: (val, row) => (
          <Fragment>
            <AuthA code={codes.deviceManagement.tagLibrary.edit} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该图标吗？" onConfirm={() => this.handleDelete(row.id)}>
              <AuthA code={codes.deviceManagement.tagLibrary.delete}>删除</AuthA>
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
        tagLibrary: {
          pagination: { total = 0 },
        },
      },
    } = this.props
    const { detail, modalVisible, imageUrl, uploading } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title, name: title },
    ]
    const modalProps = {
      detail,
      visible: modalVisible,
      onCancel: this.handleCloseModal,
      onOk: this.handleConformModal,
      imageUrl,
      uploading,
      saveState: this.saveState,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`图标总数：${total}`}
        extraContent={
          (<Button type="primary" onClick={this.handleViewAdd}>新增</Button>)
        }
      >
        {this.renderFilter()}
        {this.renderTable()}
        <RenderModal {...modalProps} />
        {this.renderImageDetail()}
      </PageHeaderLayout>
    )
  }
}
