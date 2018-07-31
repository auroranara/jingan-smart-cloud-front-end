import React, { PureComponent, Fragment } from 'react';
import { Form, Card, Input, Button, Table, Divider, Modal, Popconfirm, TreeSelect } from 'antd'
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

const FormItem = Form.Item

const title = "部门管理"
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一起一档',
    name: '一起一档',
  },
  {
    title: '企业单位',
    name: '企业单位',
    href: '/base-info/company/list',
  },
  {
    title,
    name: title,
  },
]

const RenderModal = Form.create()((props) => {
  const { form: { getFieldDecorator, validateFields, resetFields }, modalTitle, modalVisible, modalStatus, handleCloseModal, doAdd, doEdit } = props
  const formItemCol = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
    },
  }
  const okHandle = () => {
    console.log('props', props);
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      return (modalStatus === 'add' && doAdd(fieldsValue)) || (modalStatus === 'addUnder' && doAdd(fieldsValue)) || (modalStatus === 'edit' && doEdit(fieldsValue))
    });
  };

  const treeData = [{
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [{
      title: 'Child Node1',
      value: '0-0-1',
      key: '0-0-1',
    }, {
      title: 'Child Node2',
      value: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  }];
  return (
    <Modal title={modalTitle}
      visible={modalVisible}
      onCancel={handleCloseModal}
      onOk={okHandle}>
      <Form>
        <FormItem {...formItemCol} label="部门名称：">
          {getFieldDecorator('departmentName', {
            getValueFromEvent: e => e.target.value.trim(),
          })(<Input></Input>)}
        </FormItem>
        <FormItem {...formItemCol} label="上级部门：">
          {getFieldDecorator('upperDepartment', {

          })(<TreeSelect
            disabled={modalStatus === 'addUnder'}
            dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
            treeData={treeData}
            onChange={this.onChange}
          />)}
        </FormItem>
      </Form>
    </Modal>
  )
})

@connect(
  ({ department, loading }) => ({
    department,
    loading: loading.models.department,
  })
)

@Form.create()
export default class DepartmentList extends PureComponent {
  state = {
    modalVisible: false,
    modalStatus: '',
    modalTitle: '',
  }

  handleQuery = () => {
    const { form: { getFieldsValue } } = this.props
    const query = getFieldsValue()
    console.log('query', query);
  }

  // 重置搜索
  resetQuery = () => {
    const { form: { resetFields } } = this.props
    resetFields()
  }

  // 打开新建弹窗
  handleShowModal = status => {
    this.setState({ modalVisible: true, modalStatus: status, modalTitle: (status === 'add' && '新建部门') || (status === 'addUnder' && '添加下属部门') || (status === 'edit' && '编辑部门') })
  }

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  handleAdd = () => {
    this.handleShowModal('add')
  }

  // 删除部门
  handleDelete = rows => {
    console.log('rows', rows);

  }

  doAdd = formData => {
    console.log('addform', formData);

  }

  doEdit = formData => {
    console.log('editform', formData);
  }

  // 渲染搜索栏
  renderQuery() {
    const { form: { getFieldDecorator } } = this.props

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input style={{ width: '250px' }} placeholder="请输入部门名称" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.handleQuery} type="primary">查询</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.resetQuery}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button onClick={this.handleAdd} type="primary">新增</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }

  // 渲染部门树
  renderTable() {
    const { department: { data: { list } } } = this.props
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      },
      {
        title: '账号数量',
        dataIndex: 'number',
        key: 'number',
        width: '20%',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, rows) => (
          <Fragment>
            <a onClick={() => this.handleShowModal('addUnder')}>添加</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleShowModal('edit')}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该部门吗？" onConfirm={() => this.handleDelete(rows)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }}>
        <Table rowKey='id' columns={columns} dataSource={list} pagination={false}></Table>
      </Card>
    )
  }

  render() {
    const parentData = {
      ...this.state,
      handleCloseModal: this.handleCloseModal,
      doAdd: this.doAdd,
      doEdit: this.doEdit,
    }
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderQuery()}
        {this.renderTable()}
        <RenderModal {...parentData} />
      </PageHeaderLayout>
    )
  }
}
