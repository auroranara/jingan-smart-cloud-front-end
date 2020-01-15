import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../Monitor/index.less';
import { getSrc } from '../utils';

const TITLE = '地图管理';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: TITLE, name: TITLE },
];;

@connect(({ user }) => ({
  user,
}))
export default class Map extends PureComponent {
  render() {
    const {
      user: {
        currentUser: { companyBasicInfo },
      },
    } = this.props;

    const { mapIp, buildId, secret } = companyBasicInfo || {};
    const src = getSrc('mapManagement', mapIp, buildId, secret);
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      >
        <iframe className={styles.iframe} title="map" src={src} />
      </PageHeaderLayout>
    );
  }
}
