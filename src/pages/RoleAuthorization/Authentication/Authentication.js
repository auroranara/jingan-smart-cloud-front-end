import React, { PureComponent } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Card, Table, message, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority } from '@/utils/customAuth';

const EditAuth = 'roleAuthorization.authentication.edit';
const List = [
  {
    id: 1,
    complexity: '简单',
    rules: '密码长度为6-16个字符，其中必须包含字母、数字',
    example: 'a12345',
  },
  {
    id: 2,
    complexity: '一般',
    rules: '密码长度为6-16个字符，其中必须包含大写字母、小写字母和数字',
    example: 'An12345',
  },
  {
    id: 3,
    complexity: '复杂',
    rules: '密码长度为6-16个字符，其中必须包含大写字母、小写字母、数字和特殊字符（除空格）',
    example: 'An#12345',
  },
];

const Columns = [
  {
    title: '难易程度',
    dataIndex: 'complexity',
    key: 'complexity',
    width: 200,
  },
  {
    title: '规则内容',
    dataIndex: 'rules',
    key: 'rules',
  },
  {
    title: '示例',
    dataIndex: 'example',
    key: 'example',
    width: 200,
  },
];

@connect(({ company, user, loading }) => ({
  company,
  user,
  loading: loading.models.company,
}))
export default class Authentication extends PureComponent {
  state = {
    selectedRowKeys: [1],
  };

  componentDidMount() {
    const {
      dispatch,
      companyId,
      user: {
        currentUser: { companyId: selfCompanyId, unitType },
      },
    } = this.props;
    dispatch({
      type: 'company/fetchCompany',
      payload: {
        id: +unitType === 4 ? selfCompanyId : companyId,
      },
      success: ({ passwordRule }) => {
        if (!passwordRule) return;
        this.setState({ selectedRowKeys: [+passwordRule] });
      },
    });
  }

  handleSelectChange = selectedRowKeys => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const editCode = hasAuthority(EditAuth, permissionCodes);
    if (!editCode) return;
    this.setState({ selectedRowKeys });
  };

  handleClickSubmit = () => {
    const {
      dispatch,
      company: {
        detail: { data },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'company/editCompany',
      payload: {
        ...data,
        passwordRule: selectedRowKeys[0],
      },
      success: () => {
        message.success('修改成功');
        this.handleClickCancle();
      },
      error: () => {
        message.error(`修改失败`);
      },
    });
  };

  handleClickCancle = () => {
    const { handleParentChange } = this.props;
    handleParentChange({ companyId: undefined });
  };

  render() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
      loading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const editCode = hasAuthority(EditAuth, permissionCodes);

    return (
      <PageHeaderLayout title="身份鉴别">
        <Card bordered={false}>
          <Table
            loading={loading}
            bordered
            size="middle"
            rowKey="id"
            dataSource={List}
            columns={Columns}
            rowSelection={{
              selectedRowKeys,
              onChange: this.handleSelectChange,
              hideDefaultSelections: true,
              type: 'radio',
              // ...rowSelection,
            }}
            pagination={false}
          />
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button style={{ marginRight: editCode ? 10 : 0 }} onClick={this.handleClickCancle}>
              取消
            </Button>
            {editCode && (
              <Button type="primary" onClick={this.handleClickSubmit} loading={loading}>
                提交
              </Button>
            )}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
