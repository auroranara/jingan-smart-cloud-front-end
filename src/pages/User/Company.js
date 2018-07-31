import React from 'react';
import { Layout } from 'antd';
const { Header, Content } = Layout;
// import { Link } from 'dva/router';
// import styles from './RiskPoint.less';

class UserLayout extends React.PureComponent {

  render() {
    return (
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
      </Layout>
    );
  }
}

export default UserLayout;
