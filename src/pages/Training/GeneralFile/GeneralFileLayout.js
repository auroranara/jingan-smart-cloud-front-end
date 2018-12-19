import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import router from 'umi/router';
// import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ExamFile from './ExamFile/ExamFileList';
import PersonFile from './PersonFile/PersonFileList';

const TabPane = Tabs.TabPane;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '综合档案', name: '综合档案' },
];

// 默认每页显示数量
// const defaultPageSize = 10;

export default class GeneralFileLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
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
    } = this.props;
    this.setState({ activeKey: type });
  }

  /**
   * 获取考试档案列表
   */
  handleExamFileList = () => {};

  /**
   * 获取人员档案列表
   */
  handlePersonFileList = () => {};

  /**
   * 切换tab
   */
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/generalFile/${key}/list`);
    });
  };

  // 渲染页面
  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderLayout title="综合档案" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col>
            <Card>
              <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                <TabPane tab="考试档案" key="examFile">
                  {activeKey === 'examFile' && (
                    <ExamFile handleExamFileList={this.handleExamFileList} />
                  )}
                </TabPane>
                <TabPane tab="人员档案" key="personFile">
                  {activeKey === 'personFile' && (
                    <PersonFile handlePersonFileList={this.handlePersonFileList} />
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
