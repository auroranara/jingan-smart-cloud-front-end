import { Component, Fragment } from 'react';
import {
  Form,
  Modal,
  Table,
  Button,
  Row,
  Col,
  Input,
  Tag,
  Divider,
  Card,
  Select,
} from 'antd';
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import codes from '@/utils/codes';

const FormItem = Form.Item;
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

// 新增/编辑弹窗
const HandleModal = Form.create()(props => {
  const {
    form: { getFieldDecorator },
    visible,
    onOk,
    onCancel,
    detail,
  } = props;

  return (
    <Modal
      title={detail && detail.id ? '编辑隐患标准' : '新增隐患标准'}
      visible={visible}
      width={800}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form>
        <FormItem label="名称" {...formWrapper}>
          {getFieldDecorator('name')(
            <Input placeholder="名称" />
          )}
        </FormItem>
        <FormItem label="流程数" {...formWrapper}>
          {getFieldDecorator('num')(
            <Input placeholder="流程数" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

@Form.create()
@connect(({ hiddenDangerControl }) => ({
  hiddenDangerControl,
}))
export default class StandardDatabase extends Component {

  state = {
    detail: {},
    handleModalVisible: false, // 新增/编辑弹窗是否显示
  }

  // 查询数据
  handleQuery = () => { }

  // 重置筛选
  handleReset = () => { }

  // 打开新增弹窗
  handleViewAdd = () => {
    this.setState({ handleModalVisible: true, detail: {} })
  }

  // 新增/编辑提交
  handleSubmit = () => { }

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
                {getFieldDecorator('name')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('aa')(
                  <Select placeholder="业务分类" allowClear></Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('bb')(
                  <Select placeholder="所属行业" allowClear></Select>
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
      hiddenDangerControl: {
        standardDatabase: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '流程数',
        dataIndex: 'num',
        align: 'center',
      },
      {
        title: '业务分类',
        dataIndex: 'a',
        align: 'center',
      },
      {
        title: '所属行业',
        dataIndex: 'b',
        align: 'center',
      },
      {
        title: '项目分类',
        dataIndex: 'aa',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthA code={processCode}>检查流程</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthA code={deleteCode}>删除</AuthA>
          </Fragment>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="id"
            // loading={tableLoading}
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
              pageSizeOptions: ['5', '10', '15', '20'],
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
      },
    } = this.props;
    const { handleModalVisible, detail } = this.state;
    const modalProps = {
      visible: handleModalVisible,
      detail,
      onOk: this.handleSubmit,
      onCancel: () => { this.setState({ handleModalVisible: false }) },
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
