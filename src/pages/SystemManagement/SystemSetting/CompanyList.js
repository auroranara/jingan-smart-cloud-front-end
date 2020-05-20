import { Component, Fragment } from 'react';
import { Table, Card, Input, Modal, message, Spin } from 'antd';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import router from 'umi/router';
import { AuthButton, AuthA, AuthPopConfirm, hasAuthority } from '@/utils/customAuth';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import CompanySelect from '@/jingan-components/CompanySelect';

const {
  systemSetting: {
    setting: settingCode,
    addCompany: addCode,
  },
} = codes;

const title = '系统配置';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '系统管理',
    name: '系统管理',
  },
  {
    title,
    name: title,
  },
];
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

@Form.create()
@connect(({ systemManagement, loading }) => ({
  systemManagement,
}))
export default class SystemSettingCompany extends Component {

  state = {
    companyModalVisible: false,
  }

  componentDidMount () {
    this.handleQuery();
  }

  // 查询列表
  handleQuery = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemManagement/fetchSystemSetting',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
    })
  }

  handleReset = () => {
    this.handleQuery();
  }

  // 点击新增打开新增单位
  handleViewAdd = () => {
    this.setState({ companyModalVisible: true })
  }

  handleSetting = row => {
    router.push(`/system-management/system-setting/setting/${row.id}?companyId=${row.companyId}`);
  }

  // 新增单位
  handleAddCompany = () => {
    const { dispatch, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (err) return;
      const { company } = values;
      dispatch({
        type: 'systemManagement/addSystemCompany',
        payload: { companyId: company.key },
        callback: (success, msg) => {
          if (success) {
            message.success('新增成功');
            this.setState({ companyModalVisible: false });
            this.handleQuery();
          } else {
            message.error(msg || '新增失败');
          }
        },
      })
    });
  }

  renderForm = () => {
    const fields = [
      {
        id: 'companyName',
        render: () => <Input placeholder="请输入单位名称" />,
      },
    ];
    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={values => this.handleQuery(values)}
          onReset={this.handleReset}
          action={
            <AuthButton type="primary" onClick={this.handleViewAdd} code={addCode}>
              新增
            </AuthButton>
          }
        />
      </Card>
    );
  }

  render () {
    const {
      loading = false,
      systemManagement: {
        systemSetting: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { companyModalVisible } = this.state;
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 250,
      },
      {
        title: '地址',
        dataIndex: 'area',
        align: 'center',
        width: 250,
        render: (_, { companyBasicInfo = {} }) => {
          const {
            practicalProvinceLabel,
            practicalCityLabel,
            practicalDistrictLabel,
            practicalTownLabel,
            practicalAddress,
          } = companyBasicInfo;
          return (practicalProvinceLabel || '') +
            (practicalCityLabel || '') +
            (practicalDistrictLabel || '') +
            (practicalTownLabel || '') +
            (practicalAddress || '');
        },
      },
      {
        title: '安全管理员',
        key: 'name',
        align: 'center',
        width: 200,
        render: (_, { companyBasicInfo = {} }) => companyBasicInfo.safetyName,
      },
      {
        title: '联系电话',
        key: 'phone',
        align: 'center',
        width: 200,
        render: (_, { companyBasicInfo = {} }) => companyBasicInfo.safetyPhone,
      },
      {
        title: '操作',
        key: 'option',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <AuthA code={settingCode} onClick={() => this.handleSetting(row)}>
              设置
            </AuthA>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：{total || 0}
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              // scroll={{ x: 'max-content' }}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
                onChange: (pageNum, pageSize) => {
                  this.handleQuery({ pageNum, pageSize });
                },
                onShowSizeChange: (pageNum, pageSize) => {
                  this.handleQuery({ pageNum, pageSize });
                },
              }}
            />
          </Card>
        ) : (
            <Spin spinning={loading}>
              <Card style={{ marginTop: '20px', textAlign: 'center' }}>
                <span>暂无数据</span>
              </Card>
            </Spin>
          )}
        <Modal
          title="选择新增单位"
          visible={companyModalVisible}
          onCancel={() => this.setState({ companyModalVisible: false })}
          onOk={this.handleAddCompany}
          destroyOnClose
        >
          <Form>
            <Form.Item label="单位名称" {...formItemLayout}>
              {getFieldDecorator('company', {
                rules: [{ required: true, message: '请选择单位' }],
              })(
                <CompanySelect />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
