import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../Monitor/index.less';
import { getSrc } from '../utils';

const TITLE = '报警查看';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: TITLE, name: TITLE },
];;

@connect(({ user }) => ({
  user,
}))
export default class Alarm extends PureComponent {
  render() {
    const {
      user: {
        currentUser: { companyBasicInfo },
      },
    } = this.props;

    const { mapIp, mapBuildId, mapSecret } = companyBasicInfo || {};
    const src = getSrc('alarms', mapIp, mapBuildId, mapSecret);
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        className={styles.container}
      >
        <iframe className={styles.iframe} title="alarm" src={src} />
      </PageHeaderLayout>
    );
  }
}
