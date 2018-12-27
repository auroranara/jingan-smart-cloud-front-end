import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './MyFile.less';

// 标题
const title = '成绩分析报告';

function reportDownload() {
  const iframe = document.getElementById('reportIframe').contentWindow;
  iframe.print();
}

function setIframeHeight() {
  const ifm = document.getElementById('reportIframe');
  ifm.height = ifm.contentWindow.document.getElementById('reportIframe').scrollHeight;
}

window.onresize = function() {
  setTimeout(() => {
    setIframeHeight();
  }, 1000);
};

@connect(({ myFile }) => ({
  myFile,
}))
export default class MyAnalysis extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { studentId },
      },
    } = this.props;
    dispatch({
      type: 'myFile/fetchExamReport',
      payload: {
        examId: id,
        studentId: studentId,
      },
    });
  }

  render() {
    const {
      location: {
        query: { studentId },
      },
      match: {
        params: { id },
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
        name: '成绩分析报告',
      },
    ];

    return (
      <PageHeaderLayout
        title="成绩分析报告"
        breadcrumbList={breadcrumbList}
        content={<div />}
        extraContent={
          <Button className={styles.backBtn} onClick={reportDownload}>
            下载
          </Button>
        }
      >
        <iframe
          title="report"
          frameBorder="0"
          id="reportIframe"
          width="100%"
          scrolling="no"
          src={`#/training/myFile/analysisReport/${id}`}
          onLoad={() => {
            setTimeout(() => {
              setIframeHeight();
            }, 1000);
          }}
        />
      </PageHeaderLayout>
    );
  }
}
