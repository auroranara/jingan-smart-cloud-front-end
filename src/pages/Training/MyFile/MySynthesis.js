import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './MyFile.less';

function synthesisDownLoad() {
  const iframe = document.getElementById('reportIframe').contentWindow;
  iframe.print();
}

// 标题
const title = '综合分析报告';

@connect(({ myFile }) => ({
  myFile,
}))
export default class MySynthesis extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { studentId },
      },
    } = this.props;
    dispatch({
      type: 'myFile/fetchMySelfReport',
      payload: {
        studentId: studentId,
      },
    });
  }
  render() {
    const {
      location: {
        query: { studentId },
      },
    } = this.props;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '教育培训',
        name: '教育培训',
      },
      {
        title: '我的档案',
        name: '我的档案',
        href: `/training/myFile/myFileList?studentId=${studentId}`,
      },
      {
        title,
        name: '综合分析报告',
      },
    ];

    return (
      <PageHeaderLayout
        title="综合分析报告"
        breadcrumbList={breadcrumbList}
        content={<div />}
        extraContent={
          <Button className={styles.backBtn} onClick={synthesisDownLoad}>
            下载
          </Button>
        }
      >
        <iframe
          title="report"
          frameBorder="0"
          id="reportIframe"
          width="100%"
          height="800"
          scrolling="no"
          src={`#/training/myFile/SynthesisReport?studentId=${studentId}`}
        />
      </PageHeaderLayout>
    );
  }
}
