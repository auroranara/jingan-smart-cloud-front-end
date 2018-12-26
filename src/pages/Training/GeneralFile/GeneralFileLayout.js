import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs, Input, Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

import ExamFile from './ExamFile/ExamFileList';
import PersonFile from './PersonFile/PersonFileList';

const TabPane = Tabs.TabPane;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '综合档案', name: '综合档案' },
];

// 默认每页显示数量
const defaultPageSize = 10;

@connect(({ generalFile, user }) => ({
  generalFile,
  user,
}))
export default class GeneralFileLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      visible: false,
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      match: {
        params: { type = 'examFile' },
      },
      user: {
        currentUser: { companyId },
      },
      generalFile: { searchInfo },
    } = this.props;

    this.companyId = companyId;
    if (searchInfo && searchInfo.companyId) {
      this.companyId = searchInfo.companyId;
      this.companyName = searchInfo.companyName;
    }

    const payload = { pageSize: defaultPageSize, pageNum: 1 };
    if (!companyId) this.fetchCompany({ payload });

    this.setState({ activeKey: type });
  }

  /**
   * 显示企业弹出框
   */
  handleFocus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalFile/fetchCompanies',
      payload: {
        pageSize: defaultPageSize,
        pageNum: 1,
      },
    });
    this.setState({ visible: true });
  };

  /**
   * 获取企业
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'generalFile/fetchCompanies', payload });
  };

  /**
   * 关闭企业弹出框
   */
  handleClose = () => {
    this.setState({ visible: false });
  };

  /**
   * 选择企业
   */
  handleSelect = item => {
    const {
      match: {
        params: { type },
      },
      dispatch,
    } = this.props;
    const { id, name } = item;
    this.companyId = id;
    this.companyName = name;
    // 判断tabs当前类型
    if (type === 'examFile') {
      this.handleExamFileList();
    } else {
      this.handlePersonFileList();
    }
    // 保存企业选择框数据
    dispatch({
      type: 'generalFile/saveSearchInfo',
      payload: {
        companyId: id,
        companyName: name,
      },
    });
    this.handleClose();
  };

  /**
   * 获取考试档案列表
   */
  handleExamFileList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalFile/fetchExamList',
      payload: {
        companyId: this.companyId,
        pageSize: defaultPageSize,
        pageNum: 1,
      },
    });
  };

  /**
   * 获取人员档案列表
   */
  handlePersonFileList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalFile/fetchPersonalList',
      payload: {
        companyId: this.companyId,
        pageSize: defaultPageSize,
        pageNum: 1,
      },
    });
  };

  /**
   * 切换tab
   */
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/generalFile/${key}/list`);
    });
  };

  // 渲染企业模态框
  renderModal() {
    const {
      generalFile: { modal },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={visible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  // 渲染页面
  render() {
    const { activeKey } = this.state;
    const {
      user: {
        currentUser: { companyId },
      },
      generalFile: {
        examData: {
          list,
          pagination: { total },
        },
        personalData: {
          list: personalList,
          pagination: { total: personalTotal },
        },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title="综合档案"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            {!companyId && (
              <Input
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={this.companyName}
                disabled
              />
            )}
            {!companyId && (
              <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.handleFocus}>
                选择单位
              </Button>
            )}
            <div>
              {list.length > 0 &&
                activeKey === 'examFile' && (
                  <p style={{ marginTop: 6, marginLeft: 2 }}>
                    列表记录：
                    {total}
                  </p>
                )}
              {personalList.length > 0 &&
                activeKey === 'personFile' && (
                  <p style={{ marginTop: 6, marginLeft: 2 }}>
                    列表记录：
                    {personalTotal}
                  </p>
                )}
            </div>
          </div>
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              {this.companyId ? (
                <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                  <TabPane tab="考试档案" key="examFile">
                    {activeKey === 'examFile' && (
                      <ExamFile
                        handleExamFileList={this.handleExamFileList}
                        companyId={this.companyId}
                      />
                    )}
                  </TabPane>
                  <TabPane tab="人员档案" key="personFile">
                    {activeKey === 'personFile' && (
                      <PersonFile
                        handlePersonFileList={this.handlePersonFileList}
                        companyId={this.companyId}
                      />
                    )}
                  </TabPane>
                </Tabs>
              ) : (
                <div style={{ textAlign: 'center' }}>{'请先选择单位'}</div>
              )}
            </Card>
          </Col>
        </Row>
        {!companyId && this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
