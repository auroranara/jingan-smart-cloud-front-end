import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  Table,
  Divider,
  Modal,
  Popconfirm,
  TreeSelect,
  message,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import { arrayify } from 'tslint/lib/utils';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;

const title = '部门管理';
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
    title: '单位管理',
    name: '单位管理',
    href: '/base-info/company/list',
  },
  {
    title,
    name: title,
  },
];

const RenderModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    list,
    detail,
    modalTitle,
    modalVisible,
    modalStatus,
    handleCloseModal,
    doAdd,
    doEdit,
  } = props;
  const formItemCol = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
    },
  };
  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      return (
        (modalStatus === 'add' && doAdd(fieldsValue)) ||
        (modalStatus === 'addUnder' && doAdd(fieldsValue)) ||
        (modalStatus === 'edit' && doEdit({ ...fieldsValue, id: detail.id }))
      );
    });
  };

  const handleClos = () => {
    resetFields();
    handleCloseModal();
  };

  /* 渲染树节点 */
  const renderTreeNodes = data => {
    return data.map(item => {
      const { id, name, children } = item;
      const disabled = detail.id && (detail.id === id || item.parentIds.indexOf(detail.id) > -1);
      if (children) {
        return (
          <TreeNode disabled={disabled} title={name} key={id} value={id}>
            {renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode disabled={disabled} title={name} key={id} value={id} />;
    });
  };

  return (
    <Modal title={modalTitle} visible={modalVisible} onCancel={handleClos} onOk={okHandle}>
      <Form>
        <FormItem {...formItemCol} label="部门名称：">
          {getFieldDecorator('name', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.name : null,
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入部门名称' },
              { max: 30, message: '部门名称过长' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemCol} label="上级部门：">
          {getFieldDecorator('parentId', {
            initialValue:
              (modalStatus === 'addUnder' && detail.id) ||
              (modalStatus === 'edit' && detail.parentId !== '0' && detail.parentId) ||
              '',
          })(
            <TreeSelect
              disabled={modalStatus === 'addUnder'}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              allowClear
            >
              {renderTreeNodes(list)}
            </TreeSelect>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ department, loading }) => ({
  department,
  tableLoading: loading.effects['department/fetchDepartmentList'],
}))
@Form.create()
export default class DepartmentList extends PureComponent {
  state = {
    modalVisible: false, // 控制弹窗显示
    modalStatus: '', // 增删改状态
    modalTitle: '', // 弹窗标题
    detail: {},
    expandedRowKeys: [], // 展开的树节点
    searchName: '',
    total: 0,
  };

  componentDidMount() {
    this.getDepartments();
  }

  // 获取部门列表
  getDepartments = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'department/fetchDepartmentList',
      payload: { companyId: id },
      callback: list => {
        if (list.length === 0) return;
        let total = 0;
        const generateTotal = arr => {
          for (const item of arr) {
            total++;
            if (Array.isArray(item.children)) generateTotal(item.children);
          }
        };
        generateTotal(list);
        this.setState({ total });
      },
    });
  };

  // 部门搜索
  handleQuery = async () => {
    // let temp = []
    const {
      form: { getFieldValue },
      department: {
        data: { list },
      },
    } = this.props;
    const name = getFieldValue('name');
    this.setState({ searchName: name });
    if (name && !this.hasName(name, list)) {
      message.error('未查询到所需数据！')
    }
    // if (name) {
    //   // this.generateExpended(name, [...list], temp)
    //   // temp = [...new Set(temp)]
    // }
  };

  // 判断数组中的名称是否包含搜索内容
  hasName = (name, list) => {
    for (const item of list) {
      const index = item.name.indexOf(name)
      if (index > -1) return true
      if (item.children) this.hasName(name, item.children)
    }
    return false
  }

  // generateExpended = (name, list, temp) => {
  //   for (const item of list) {
  //     if (item.name.indexOf(name) > -1) {
  //       item.parentIds.split('@').filter(Boolean).forEach(row => {
  //         temp.push(row)
  //       })
  //     }
  //     if (item.children) {
  //       this.generateExpended(name, item.children, temp)
  //     }
  //   }
  // }

  // handleExpand = (column, index) => {
  //   const { expandedRowKeys } = this.state
  //   console.log('column', column);
  //   console.log('index', index);
  //   // expandedRowKeys.includes(index.name)
  //   // this.setState({expandedRowKeys:[...expandedRowKeys,index.name]})

  // }
  // onExpandedRowsChange = expandedRows => {
  //   console.log('expandedRows', expandedRows);

  // }

  // 重置搜索
  resetQuery = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.setState({ searchName: '' });
    this.getDepartments();
  };

  // 打开新建弹窗,status有三个参数：add\addUnder\edit
  handleShowModal = async (status, rows = {}) => {
    await this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle:
        (status === 'add' && '新建部门') ||
        (status === 'addUnder' && '添加下属部门') ||
        (status === 'edit' && '编辑部门'),
      detail: { ...rows },
    });
  };

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  // 删除部门
  handleDelete = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/deleteDepartment',
      payload: rows.id,
      callback: response => {
        if (response && response.code === 200) {
          this.getDepartments();
          message.success('删除成功！');
        } else message.success(response.msg);
      },
    });
  };

  // 新建部门
  doAdd = formData => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'department/addDepartment',
      payload: { ...formData, companyId: id },
      callback: response => {
        if (response && response.code === 200) {
          this.handleCloseModal();
          this.getDepartments();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };
  // 编辑部门
  doEdit = formData => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'department/editDepartment',
      payload: { ...formData, companyId: id },
      callback: response => {
        if (response && response.code === 200) {
          this.handleCloseModal();
          this.getDepartments();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  flattenList = list => {
    return list.reduce(
      (arr, a) => arr.concat(Array.isArray(a.children) ? (a, this.flattenList(a.children)) : a),
      []
    );
  };

  // 渲染搜索栏
  renderQuery() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input style={{ width: '250px' }} placeholder="请输入部门名称" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.handleQuery} type="primary">
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.resetQuery}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button onClick={() => this.handleShowModal('add')} type="primary">
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  // 渲染部门树
  renderTable() {
    const {
      tableLoading,
      department: {
        data: { list },
      },
    } = this.props;
    const { searchName } = this.state;
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: val => {
          const index = val.indexOf(searchName);
          return searchName && index > -1 ? (
            <span>
              {val.substr(0, index)}
              <span style={{ color: '#f50' }}>{searchName}</span>
              {val.substr(index + searchName.length)}
            </span>
          ) : (
              <span>{val}</span>
            );
        },
      },
      {
        title: '账号数量',
        dataIndex: 'allUserCount',
        key: 'allUserCount',
        width: '20%',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, rows) => (
          <Fragment>
            <a onClick={() => this.handleShowModal('addUnder', rows)}>添加</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleShowModal('edit', rows)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该部门吗？" onConfirm={() => this.handleDelete(rows)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={false}
            defaultExpandAllRows={true}
          />
        ) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    );
  }

  render() {
    const {
      department: {
        data: { list },
      },
    } = this.props;
    const { total } = this.state;
    const parentData = {
      ...this.state,
      handleCloseModal: this.handleCloseModal,
      doAdd: this.doAdd,
      doEdit: this.doEdit,
      list,
    };

    const content =
      list && list.length ? (
        <span>
          部门总数：
          {total}
        </span>
      ) : (
          <span>部门总数：0</span>
        );
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} content={content}>
        {this.renderQuery()}
        {this.renderTable()}
        <RenderModal {...parentData} />
      </PageHeaderLayout>
    );
  }
}
