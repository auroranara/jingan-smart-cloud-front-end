import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Switch, message } from 'antd';
// import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';

// const { Description } = DescriptionList;

const FormItem = Form.Item;

const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '消防维保',
  },
  {
    title: '维保公司',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '修改维保单位',
  },
];
// 默认页面显示数量列表
const pageSizeOptions = ['5', '10', '15', '20'];
// 表格列
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
/* 默认分页参数 */
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

@connect(({ maintenanceCompany, company, loading }) => ({
  maintenanceCompany,
  company,
  loading: loading.effects['maintenanceCompany/fetchDetail'],
}))
@Form.create()
export default class MaintenanceCmpanyEdit extends PureComponent {
  state = {
    hasSubcompany: false,
    modal: {
      visible: false,
      loading: false,
      selectedRowKeys: [],
    },
  };

  componentDidMount() {
    const that = this;

    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch({
      type: 'maintenanceCompany/fetchDetail',
      payload: {
        id,
      },
      callback(isBranch) {
        // console.log(isBranch);
        that.setState({ hasSubcompany: isBranch });
      },
    });
  }

  switchOnchange = checked => {
    this.setState({ hasSubcompany: checked });
  };

  handleUpdate(id) {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        // console.log(err);
        return;
      }

      const { companyId, usingStatus, isBranch, parentId } = values;
      // console.log(values, usingStatus, usingStatus ? 1 : 0);

      dispatch({
        type: 'maintenanceCompany/updateMaintenanceCompanyAsync',
        payload: {
          id,
          companyId,
          parentId,
          usingStatus: usingStatus ? 1 : 0,
          isBranch: isBranch ? 1 : 0,
        },
        callback(code) {
          // console.log(code);
          if (code === 200) message.info('修改成功');
          else message.error('修改失败');
        },
      });
    });
  }

  /* 显示模态框 */
  handleShowModal = () => {
    const { fetchModalList } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        visible: true,
      },
    });
    fetchModalList({
      payload: {
        ...defaultPagination,
      },
    });
  };

  /* 隐藏模态框 */
  handleHideModal = () => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        visible: false,
      },
    });
  };

  /* 查询按钮点击事件 */
  handleSearch = value => {
    const {
      fetchModalList,
      company: {
        modal: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        ...value,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        ...value,
        ...defaultPagination,
        pageSize,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleReset = value => {
    const {
      fetchModalList,
      company: {
        modal: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        ...value,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        ...value,
        ...defaultPagination,
        pageSize,
      },
    });
  };

  /* 选择更换 */
  handleSelectChange = selectedRowKeys => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        selectedRowKeys,
      },
    });
  };

  /* 选择按钮点击事件 */
  handleSelect = () => {
    const {
      modal: { selectedRowKeys },
    } = this.state;
    const {
      company: {
        modal: { list },
      },
      form: { setFieldsValue },
    } = this.props;
    const selectedData = list.filter(item => item.id === selectedRowKeys[0])[0];
    setFieldsValue({ maintenanceId: selectedData.name });
    this.setState({
      // maintenanceId: selectedData.id,
    });
    this.handleHideModal();
  };

  /* 更换页码或显示数量 */
  handleChangePagination = ({ current, pageSize }) => {
    const { fetchModalList } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        name: modal.name,
        pageNum: current,
        pageSize,
      },
    });
  };

  /* 渲染选择维保单位模态框 */
  renderModal() {
    const {
      modal: { loading, visible, selectedRowKeys },
    } = this.state;
    const {
      company: {
        modal: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框宽度
      width: '900px',
      // 模态框标题
      title: '选择消防维修单位',
      // 模态框点击关闭按钮回调
      onClose: this.handleHideModal,
      // 完全关闭后回调
      afterClose: () => {
        this.maintenanceIdInput.blur();
      },
      // 查询回调
      onSearch: this.handleSearch,
      // 重置回调
      onReset: this.handleReset,
      // 选择回调
      onSelect: this.handleSelect,
      // 表格是否正在加载
      loading,
      // 表格大小
      size: 'middle',
      // 表格源数据
      dataSource: list,
      // 表格列
      columns,
      // 表格数据主键
      rowKey: 'id',
      // 更改显示数量或页码
      onChange: this.handleChangePagination,
      // 选择设置
      rowSelection: {
        // 选中的行
        selectedRowKeys,
        // 选中行的更换
        onChange: this.handleSelectChange,
        hideDefaultSelections: true,
        type: 'radio',
      },
      // 分页设置
      pagination: {
        // 总数
        total,
        // 当前页码
        current: pageNum,
        // 当前显示数量
        pageSize,
        // 是否显示快速跳转
        showQuickJumper: true,
        // 是否显示每页数量列表
        showSizeChanger: true,
        // 显示总数
        showTotal: t => `共 ${t} 条记录`,
        // 每页显示数量列表
        pageSizeOptions,
      },
    };

    return <CompanyModal {...modalProps} />;
  }

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const {
      maintenanceCompany: { detail: data },
    } = this.props;
    const { hasSubcompany } = this.state;

    // console.log('data', data);

    return (
      <PageHeaderLayout title="修改维保单位" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('companyId', {
                initialValue: data.companyId,
                rules: [
                  {
                    required: true,
                    message: '请选择企业',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>

            <FormItem {...formItemLayout} label="企业状态">
              {getFieldDecorator('usingStatus', {
                valuePropName: 'checked',
                initialValue: !!data.usingStatus,
                rules: [
                  {
                    required: true,
                    message: '企业状态',
                  },
                ],
              })(<Switch checkedChildren="启用" unCheckedChildren="禁用" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为分公司">
              {getFieldDecorator('isBranch', {
                valuePropName: 'checked',
                initialValue: !!data.isBranch,
                rules: [
                  {
                    required: true,
                    message: '是否为分公司',
                  },
                ],
              })(
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={this.switchOnchange}
                />
              )}
            </FormItem>

            {hasSubcompany && (
              <FormItem {...formItemLayout} label="所属总公司">
                {getFieldDecorator('parentId	', {
                  initialValue: data.parentId,
                  rules: [
                    {
                      required: true,
                      message: '所属总公司',
                    },
                  ],
                })(<Input placeholder="所属总公司" />)}
              </FormItem>
            )}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                onClick={() => this.handleUpdate(data.id)}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
