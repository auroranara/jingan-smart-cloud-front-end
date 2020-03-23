import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import { getSrc } from './utils';

const TITLE = '行为分析';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: TITLE, name: TITLE },
];;

@connect(({ user }) => ({
  user,
}))
export default class Analysis extends PureComponent {
  render() {
    const {
      user: {
        currentUser: { companyBasicInfo },
      },
    } = this.props;

    const { mapIp, mapBuildId, mapSecret, appId } = companyBasicInfo || {};
    const src = getSrc('behaviorAnalysis', mapIp, mapBuildId, mapSecret, appId);
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        className={styles.container}
      >
        <iframe className={styles.iframe} title="analysis" src={src} />
      </PageHeaderLayout>
    );
  }
}