import { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Modal,
  Table,
  Button,
  Row,
  Col,
  Input,
  Divider,
  Card,
  Select,
  message,
  Popconfirm,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
// import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;
const { TextArea } = Input;

const {
  hiddenDangerControl: {
    dangerStandardDatabase: {
      list: listUrl,
    },
  },
} = urls;
const {
  hiddenDangerControl: {
    dangerStandardDatabase: {
      process: {
        add: addCode,
        edit: editCode,
        delete: deleteCode,
      },
    },
  },
} = codes;

const title = '检查流程';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '隐患排查治理', name: '隐患排查治理' },
  { title: '隐患标准管理数据库', name: '隐患标准管理数据库', href: listUrl },
  { title, name: title },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
const formWrapper = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}
const defaultPageSize = 10;

// 新增/编辑弹窗
const HandleModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields },
    visible,
    onOk,
    onCancel,
    detail,
    checkItem,
    hiddenDangerTypes, // 隐患分类
  } = props;
  const flowId = detail ? detail.flowId : undefined;
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) return;
      const { objectTitle, necessary, ...resValues } = values;
      onOk({ ...resValues, objectId: checkItem.id, necessary: necessary ? '1' : '0' })
    })
  }
  return (
    <Modal
      title={detail && detail.objectId ? '编辑检查流程' : '新增检查流程'}
      visible={visible}
      width={800}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form>
        <FormItem label="所属检查项" {...formWrapper}>
          {getFieldDecorator('objectTitle', {
            rules: [{ required: true, message: '请输入所属检查项' }],
            initialValue: checkItem ? checkItem.name : undefined,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="隐患分类" {...formWrapper}>
          {getFieldDecorator('dangerLevel', {
            rules: [{ required: true, message: '请选择隐患分类' }],
            initialValue: flowId ? detail.dangerLevel : undefined,
          })(
            <Select placeholder="请选择" allowClear>
              {hiddenDangerTypes.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="检查流程" {...formWrapper}>
          {getFieldDecorator('flowName', {
            rules: [{ required: true, message: '请输入检查流程' }],
            initialValue: flowId ? detail.flowName : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="必要性" {...formWrapper}>
          {getFieldDecorator('necessary', {
            valuePropName: 'checked',
            initialValue: flowId ? !!+detail.necessary : undefined,
          })(
            <Checkbox>可以忽略</Checkbox>
          )}
        </FormItem>
        <FormItem label="检查方法" {...formWrapper}>
          {getFieldDecorator('checkWay', {
            rules: [{ required: true, message: '请输入检查方法' }],
            initialValue: flowId ? detail.checkWay : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <TextArea rows={2} placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ hiddenDangerControl, user, loading }) => ({
  hiddenDangerControl,
  user,
  tableLoading: loading.effects['hiddenDangerControl/fetchStandardProcessList'],
}))
export default class StandardProcessList extends Component {
  state = {
    detail: {},
    handleModalVisible: false, // 新增/编辑弹窗是否显示
  }

  constructor(props) {
    super(props);
    const { user: { currentUser }, location: { query: { objectGroupId } } } = this.props;
    const isCompany = currentUser.unitType === 4; // 企业
    const isWb = currentUser.unitType === 3; // 维保
    this.isShowHandle = (+objectGroupId === 1 && isWb) || (+objectGroupId === 2 && isCompany);
  }

  componentDidMount () {
    this.handleQuery()
  }

  // 查询数据
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      match: { params: { id: objectId } },
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'hiddenDangerControl/fetchStandardProcessList',
      payload: { ...values, pageNum, pageSize, objectId },
    })
  }

  // 重置筛选
  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields()
    this.handleQuery()
  }

  // 打开新增弹窗
  handleViewAdd = () => {
    this.setState({ handleModalVisible: true, detail: {} })
  }

  // 打开编辑弹窗
  handleViewEdit = (detail) => {
    this.setState({ handleModalVisible: true, detail })
  }

  // 删除
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hiddenDangerControl/deleteStandardProcess',
      payload: { id },
      success: () => {
        message.success('操作成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '操作失败') },
    })
  }

  // 新增/编辑提交
  handleSubmit = (payload) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const flowId = detail ? detail.flowId : undefined;
    const tag = flowId ? '编辑' : '新增';
    const success = () => {
      message.success(`${tag}成功`);
      this.setState({ handleModalVisible: false });
      this.handleQuery()
    };
    const error = res => { message.error(res ? res.msg : `${tag}失败`) };
    if (flowId) {
      // edit
      dispatch({
        type: 'hiddenDangerControl/editStandardProcess',
        payload: { ...payload, flowId },
        success,
        error,
      })
    } else {
      // add
      dispatch({
        type: 'hiddenDangerControl/addStandardProcess',
        payload,
        success,
        error,
      })
    }
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('flowName')(
                  <Input placeholder="检查流程关键字" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                {this.isShowHandle && (
                  <AuthButton code={addCode} type="primary" onClick={this.handleViewAdd}>新增</AuthButton>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
  * 渲染表格
  */
  renderTable = () => {
    const {
      tableLoading,
      hiddenDangerControl: {
        standardProcess: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 'index',
        align: 'center',
        width: 150,
        render: (val, row, index) => 1 + index,
      },
      {
        title: '必要性',
        dataIndex: 'necessary',
        align: 'center',
        width: 150,
        render: (val) => +val === 1 ? '是' : '否',
      },
      {
        title: '检查流程',
        dataIndex: 'flowName',
        align: 'center',
        width: 350,
      },
      {
        title: '检查方法',
        dataIndex: 'checkWay',
        align: 'center',
        width: 350,
      },
      ...this.isShowHandle ? [{
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA code={editCode} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确定要删除该数据嘛？"
              onConfirm={() => this.handleDelete(row.flowId)}>
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      }] : [],
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="flowId"
            loading={tableLoading}
            columns={columns}
            dataSource={list}
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              // pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
          />
        ) : (
            <div style={{ width: '100%', textAlign: 'center' }}><span>暂无数据</span></div>
          )}
      </Card>
    )
  }

  render () {
    const {
      location: { query: { checkItemTitle } },
      match: { params: { id: checkItemId } },
      hiddenDangerControl: {
        standardProcess: {
          pagination: { total },
        },
        // 隐患分类
        hiddenDangerTypes,
      },
    } = this.props;
    const { handleModalVisible, detail } = this.state;

    const modalProps = {
      visible: handleModalVisible,
      detail,
      onOk: this.handleSubmit,
      onCancel: () => { this.setState({ handleModalVisible: false }) },
      checkItem: { id: checkItemId, name: checkItemTitle }, // 检查项
      hiddenDangerTypes, // 隐患分类
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span>共计：{total}</span>}
      >
        {this.renderFilter()}
        {this.renderTable()}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={e => window.close()}>
            返回
          </Button>
        </div>
        <HandleModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
