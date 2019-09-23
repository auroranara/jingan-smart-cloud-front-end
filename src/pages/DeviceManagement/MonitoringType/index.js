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
  Select,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import { arrayify } from 'tslint/lib/utils';
import { AuthButton, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;

const title = '监测类型';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
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
    tagList,
  } = props;
  const formItemCol = {
    labelCol: {
      span: 5,
      offset: 2,
    },
    wrapperCol: {
      span: 12,
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
      const { id, name, child } = item;
      const disabled = detail.id && (detail.id === id || item.parentIds.indexOf(detail.id) > -1);
      if (child) {
        return (
          <TreeNode disabled={disabled} title={name} key={id} value={id}>
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return <TreeNode disabled={disabled} title={name} key={id} value={id} />;
    });
  };
  /*
    说明：
    1、根节点已经预先添加，用户无法添加、编辑；
    2、所以子节点必须选择上级监测类型
  */
  return (
    <Modal width={600} title={modalTitle} visible={modalVisible} onCancel={handleClos} onOk={okHandle}>
      <Form>
        <FormItem {...formItemCol} label="监测类型名称：">
          {getFieldDecorator('name', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.name : null,
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入监测类型名称' },
              { max: 30, message: '监测类型名称过长' },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemCol} label="上级监测类型：">
          {getFieldDecorator('parentId', {
            initialValue:
              (modalStatus === 'addUnder' && detail.id) ||
              (modalStatus === 'edit' && detail.parentId !== '0' && detail.parentId) ||
              '',
            // rules: modalStatus === 'edit' && detail.parentId === '0' ? null : [{ required: true, message: '请选择上级监测类型' }],
          })(
            <TreeSelect
              disabled={modalStatus === 'addUnder' || detail.parentId === '0'}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              allowClear
            >
              {renderTreeNodes(list)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemCol} label="图标选择：">
          {getFieldDecorator('logoId', {
            initialValue: modalStatus === 'edit' ? detail.logoId : undefined,
          })(
            <Select placeholder="请选择">
              {tagList.map(({ id, name, webUrl }) => (
                <Select.Option
                  key={id}
                  value={id}
                >
                  <img width="27" height="27" src={webUrl} alt="图标"></img>
                  <span style={{ paddingLeft: '1em' }}>{name}</span>
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchMonitoringTypes'],
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
    this.getMonitoringTypes();
    this.fetchAllTags()
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/saveMonitoringTypes',
      payload: [],
    });
  }


  /**
   * 获取全部图标
   */
  fetchAllTags = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchAllTags', payload: {} })
  }

  // 获取监测类型列表
  getMonitoringTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/fetchMonitoringTypes',
      callback: list => {
        if (list.length === 0) return;
        let total = 0;
        const generateTotal = arr => {
          for (const item of arr) {
            total++;
            if (Array.isArray(item.child)) generateTotal(item.child);
          }
        };
        generateTotal(list);
        this.setState({ total });
      },
    });
  };

  // 监测类型搜索
  handleQuery = async () => {
    let results = [];
    const {
      form: { getFieldValue },
      device: { monitoringType: list },
    } = this.props;
    const name = getFieldValue('name');
    await this.hasName(name, list, results);
    this.setState({ searchName: name });
    if (name && results.length === 0) {
      message.error('未查询到所需数据！');
    }
    // if (name) {
    //   // this.generateExpended(name, [...list], temp)
    //   // temp = [...new Set(temp)]
    // }
  };

  // 判断数组中的名称是否包含搜索内容
  hasName(name, list, results) {
    for (const item of list) {
      if (item.name.includes(name)) {
        results.push(item.name);
        return;
      } else if (item.child) this.hasName(name, item.child, results);
    }
  }

  // 重置搜索
  resetQuery = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.setState({ searchName: '' });
    this.getMonitoringTypes();
  };

  // 打开新建弹窗,status有三个参数：add\addUnder\edit
  handleShowModal = async (status, rows = {}) => {
    await this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle:
        (status === 'add' && '新建监测类型') ||
        (status === 'addUnder' && '添加下属监测类型') ||
        (status === 'edit' && '编辑监测类型'),
      detail: { ...rows },
    });
  };

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  // 删除监测类型
  handleDelete = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/deleteMonitoringTypes',
      payload: { id: rows.id },
      success: () => {
        this.getMonitoringTypes();
        message.success('删除成功！');
      },
      error: (response) => { message.success(response.msg) },
    });
  };

  // 新建监测类型
  doAdd = formData => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'device/addMonitoringTypes',
      payload: { ...formData },
      success: () => {
        this.handleCloseModal();
        this.getMonitoringTypes();
        message.success('新建成功！');
      },
      error: (response) => { message.error(response.msg) },
    });
  };
  // 编辑监测类型
  doEdit = formData => {
    const {
      dispatch,
    } = this.props;
    const { detail: { id } = {} } = this.state
    dispatch({
      type: 'device/editMonitoringTypes',
      payload: { ...formData, id },
      success: () => {
        this.handleCloseModal();
        this.getMonitoringTypes();
        message.success('编辑成功！');
      },
      error: (response) => { message.error(response.msg) },
    });
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
            })(<Input style={{ width: '250px' }} placeholder="请输入监测类型名称" />)}
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
            <AuthButton
              onClick={() => this.handleShowModal('add')}
              type="primary"
              code={codes.deviceManagement.monitoringType.add}
            >
              新增
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  renderTableImg = src => src ? (<img width="30" height="30" style={{ marginLeft: '1em' }} src={src} alt="图标"></img>) : null

  // 渲染监测类型树
  renderTable() {
    const {
      tableLoading,
      device: {
        monitoringType: list,
      },
    } = this.props;
    const { searchName } = this.state;
    const columns = [
      {
        title: '监测类型名称',
        dataIndex: 'name',
        key: 'name',
        width: '60%',
        render: (val, { logoWebUrl }) => {
          const index = val.indexOf(searchName);
          return searchName && index > -1 ? (
            <span>
              {val.substr(0, index)}
              <span style={{ color: '#f50' }}>{searchName}</span>
              {val.substr(index + searchName.length)}
              {this.renderTableImg(logoWebUrl)}
            </span>
          ) : (
              <Fragment>
                <span>{val}</span>
                {this.renderTableImg(logoWebUrl)}
              </Fragment>
            );
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, rows) => (
          <Fragment>
            <AuthA
              code={codes.deviceManagement.monitoringType.add}
              onClick={() => this.handleShowModal('addUnder', rows)}
            >
              添加
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codes.deviceManagement.monitoringType.edit}
              onClick={() => this.handleShowModal('edit', rows)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该监测类型吗？" onConfirm={() => this.handleDelete(rows)}>
              <AuthA code={codes.deviceManagement.monitoringType.delete}>删除</AuthA>
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
            childrenColumnName={'child'}
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
        monitoringType: list,
        tagLibrary: { list: tagList },
      },
    } = this.props;
    const { total } = this.state;
    const parentData = {
      ...this.state,
      handleCloseModal: this.handleCloseModal,
      doAdd: this.doAdd,
      doEdit: this.doEdit,
      list,
      tagList,
    };

    const content = (
      <span>
        监测类型总数：
          {list && list.length > 0 ? total : 0}
      </span>
    )
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} content={content}>
        {this.renderQuery()}
        {this.renderTable()}
        <RenderModal {...parentData} />
      </PageHeaderLayout>
    );
  }
}
