import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import { getSrc } from './utils';

const TITLE = '定位监控';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: TITLE, name: TITLE },
];;

@connect(({ user, systemManagement }) => ({
  user,
  systemManagement,
}))
export default class Monitor extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      user: {
        currentUser: { unitId: companyId },
      },
    } = this.props;

    companyId && dispatch({
      type: 'systemManagement/fetchSettingDetail',
      payload: { companyId },
    });
  }

  render() {
    const {
      systemManagement: { detail },
    } = this.props;

    const { url: mapIp, buildingId: mapBuildId, secret: mapSecret, userName: appId } = detail;
    const src = getSrc('location', mapIp, mapBuildId, mapSecret, appId);
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        className={styles.container}
      >
        <iframe className={styles.iframe} title="monitor" src={src} />
      </PageHeaderLayout>
    );
  }
}
