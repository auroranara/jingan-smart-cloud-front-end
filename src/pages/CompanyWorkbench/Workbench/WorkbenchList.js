import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Card, Button, Input, Select, Table, message } from 'antd';
// import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import Ellipsis from '@/components/Ellipsis';
import styles from './WorkbenchList.less';
// 标题
const title = '工作台';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title,
    name: '工作台',
  },
];

// @connect(({ loading }) => ({}))
export default class WorkbenchList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {}

  render() {
    return (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={breadcrumbList}
        content={
          <div className={styles.topWrite}>
            安全承诺公告：生产装置
            <span className={styles.writeRed}> 4</span> 套，其中运行{' '}
            <span className={styles.writeRed}> 4 </span>
            套，停产 <span className={styles.writeRed}> 0 </span>
            套，检修 <span className={styles.writeRed}> 0</span> 套, 特殊、一级、二级动火作业各{' '}
            <span className={styles.writeRed}> 0</span>、{' '}
            <span className={styles.writeRed}> 0</span>、{' '}
            <span className={styles.writeRed}> 0</span>
            处, 进入受限空间作业 <span className={styles.writeRed}> 0</span> 处, 是否处于试生产{' '}
            <span className={styles.writeRed}> 否</span>, 是否处于开停车状态{' '}
            <span className={styles.writeRed}> 否 </span>, 罐区、仓库等重大危险源是否处于安全状态{' '}
            <span className={styles.writeRed}> 是</span>。
            今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。
            主要负责人：刘军 2019年09月26日
          </div>
        }
      >
        <div className={styles.content}>
          <div className={styles.contentFirst}>1</div>
          <div className={styles.contentSecond}>2</div>
          <div className={styles.contentThird}>3</div>
          <div className={styles.contentFourth}>4</div>
          <div className={styles.contentFifth}>5</div>
        </div>
      </PageHeaderLayout>
    );
  }
}
