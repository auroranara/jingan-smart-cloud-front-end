import React, { PureComponent } from 'react';
// import { Card, Input, List, Select } from 'antd';
// import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../Monitor/index.less';

const TITLE = '地图管理';
const SRC = 'http://chem2.joysuch.com/js/tunnel.html?to=mapManagement&buildId=200647&wh=false&appid=yanshi&secret=4011a04a6615406a9bbe84fcf30533de';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: TITLE, name: TITLE },
];;

// @connect(({ loading, dataAnalysis }) => ({
//   dataAnalysis,
//   loading: loading.effects['dataAnalysis/fetchCompanyList'],
// }))
export default class Map extends PureComponent {
  render() {
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      >
        <iframe className={styles.iframe} title="map" src={SRC} />
      </PageHeaderLayout>
    );
  }
}
