import { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Table, Button, Row, Col, Input, Divider, Card, Select, message } from 'antd';
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import codes from '@/utils/codes';
import urls from '@/utils/urls';

const FormItem = Form.Item;
const { TextArea } = Input;

const {
  hiddenDangerControl: {
    // 隐患标准管理数据库
    dangerStandardDatabase: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      process: processCode,
    },
  },
} = codes;
const {
  hiddenDangerControl: {
    dangerStandardDatabase: {
      process: processUrl,
    },
  },
} = urls;

const title = '隐患标准管理数据库';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '隐患排查治理', name: '隐患排查治理' },
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
    projectCategoryOptions, // 项目分类/检查项类型
    budinessCategoryOptions,  // 业务分类
    IndustryOptions, // 所属行业
  } = props;
  const objectId = detail ? detail.objectId : undefined;
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) return;
      onOk(values)
    })
  }
  return (
    <Modal
      title={detail && detail.objectId ? '编辑隐患标准' : '新增隐患标准'}
      visible={visible}
      width={800}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form>
        <FormItem label="检查项名称" {...formWrapper}>
          {getFieldDecorator('objectTitle', {
            rules: [{ required: true, message: '请输入检查项名称' }],
            initialValue: objectId ? detail.objectTitle : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="业务分类" {...formWrapper}>
          {getFieldDecorator('businessType', {
            rules: [{ required: true, message: '请选择业务分类' }],
            initialValue: objectId ? detail.businessType : undefined,
          })(
            <Select placeholder="请选择" allowClear>
              {budinessCategoryOptions.map(({ value, label }) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="所属行业" {...formWrapper}>
          {getFieldDecorator('industry', {
            rules: [{ required: true, message: '请选择所属行业' }],
            initialValue: objectId ? detail.industry : undefined,
          })(
            <Select placeholder="请选择" allowClear>
              {IndustryOptions.map(({ value, label }) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="检查项类型" {...formWrapper}>
          {getFieldDecorator('objectGroupId', {
            rules: [{ required: true, message: '请选择检查项类型' }],
            initialValue: objectId ? detail.objectGroupId : undefined,
          })(
            <Select placeholder="请选择" allowClear>
              {projectCategoryOptions.map(({ value, label }) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="备注" {...formWrapper}>
          {getFieldDecorator('remark', {
            initialValue: objectId ? detail.remark : undefined,
          })(
            <TextArea rows={2} placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ hiddenDangerControl, loading }) => ({
  hiddenDangerControl,
  tableLoading: loading.effects['hiddenDangerControl/fetchHiddenDangerStandardList'],
}))
export default class StandardDatabase extends Component {

  constructor(props) {
    super(props);
    this.modalRef = null;
    this.state = {
      detail: {},
      handleModalVisible: false, // 新增/编辑弹窗是否显示
    }
  }

  componentDidMount () {
    const {
      form: { setFieldsValue },
      hiddenDangerControl: {
        // 隐患标准管理数据库——保存查询信息
        standardDatabaseQueryInfo = {},
      },
    } = this.props;
    setFieldsValue(standardDatabaseQueryInfo);
    this.handleQuery();
  }

  // 保存隐患标准管理数据库——保存查询信息
  saveStandardDatabaseQueryInfo = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hiddenDangerControl/saveStandardDatabaseQueryInfo',
      ...actions,
    })
  }

  // 查询数据
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'hiddenDangerControl/fetchHiddenDangerStandardList',
      payload: { ...values, pageNum, pageSize },
    })
    this.saveStandardDatabaseQueryInfo({ payload: values })
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

  // 新增/编辑提交
  handleSubmit = (payload) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const objectId = detail ? detail.objectId : undefined;
    const tag = objectId ? '编辑' : '新增';
    const success = () => {
      message.success(`${tag}成功`);
      this.setState({ handleModalVisible: false });
      this.handleQuery()
    };
    const error = res => { message.error(res ? res.msg : `${tag}失败`) };
    if (objectId) {
      // edit
      dispatch({
        type: 'hiddenDangerControl/editHiddenDangerStandard',
        payload: { ...payload, objectId },
        success,
        error,
      })
    } else {
      // add
      dispatch({
        type: 'hiddenDangerControl/addHiddenDangerStandard',
        payload,
        success,
        error,
      })
    }
  }

  // 删除
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hiddenDangerControl/deleteHiddenDangerStandard',
      payload: { id },
      success: () => {
        message.success('操作成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '操作失败') },
    })
  }

  // 跳转到检查流程列表页面
  jumpToProcess = ({ objectId, objectTitle }) => {
    router.push({
      pathname: processUrl + objectId,
      query: { checkItemTitle: objectTitle },
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      hiddenDangerControl: {
        budinessCategoryOptions,  // 业务分类
        IndustryOptions, // 所属行业
      },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('objectTitle')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('businessType')(
                  <Select placeholder="业务分类" allowClear>
                    {budinessCategoryOptions.map(({ value, label }) => (
                      <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('industry')(
                  <Select placeholder="所属行业" allowClear>
                    {IndustryOptions.map(({ value, label }) => (
                      <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleViewAdd}>新增</AuthButton>
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
        standardDatabase: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const columns = [
      {
        title: '检查项名称',
        dataIndex: 'objectTitle',
        align: 'center',
        width: 300,
      },
      {
        title: '流程数',
        dataIndex: 'itemNum',
        align: 'center',
        width: 150,
      },
      {
        title: '业务分类',
        dataIndex: 'businessTypeName',
        align: 'center',
        width: 200,
      },
      {
        title: '所属行业',
        dataIndex: 'industryName',
        align: 'center',
        width: 200,
      },
      {
        title: '检查项类型', // 项目分类
        dataIndex: 'objectGroupName',
        align: 'center',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA code={processCode} onClick={() => this.jumpToProcess(row)}>检查流程</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确定要删除该数据嘛？"
              onConfirm={() => this.handleDelete(row.objectId)}
            >删除</AuthPopConfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="objectId"
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
      hiddenDangerControl: {
        standardDatabase: {
          pagination: { total },
        },
        projectCategoryOptions, // 项目分类
        budinessCategoryOptions,  // 业务分类
        IndustryOptions, // 所属行业
      },
    } = this.props;
    const { handleModalVisible, detail } = this.state;
    const modalProps = {
      visible: handleModalVisible,
      detail,
      onOk: this.handleSubmit,
      onCancel: () => { this.setState({ handleModalVisible: false }) },
      projectCategoryOptions,
      budinessCategoryOptions,
      IndustryOptions,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span>共计：{total}</span>}
      >
        {this.renderFilter()}
        {this.renderTable()}
        <HandleModal {...modalProps} />
      </PageHeaderLayout>
    )
  }
}
