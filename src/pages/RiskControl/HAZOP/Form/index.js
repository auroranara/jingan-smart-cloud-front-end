import React, { useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card, Form, Table, Input, Select, Button } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';

export default connect(
  state => state,
  null,
  (stateProps, { dispatch }, { route, ...ownProps }) => {
    return {
      ...ownProps,
    };
  }
)(({ location: { query }, breadcrumbList, ...props }) => {
  return (
    <PageHeaderLayout>
      <Card>123</Card>
    </PageHeaderLayout>
  );
});
