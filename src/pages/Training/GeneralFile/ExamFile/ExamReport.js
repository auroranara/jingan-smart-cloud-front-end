import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../GeneralFile.less';

// 标题
const title = '综合分析报告';

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
    title: '综合档案',
    name: '综合档案',
    href: '/training/generalFile/examFile/list',
  },
  {
    title,
    name: '综合分析报告',
  },
];

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

@connect(({ generalFile }) => ({
  generalFile,
}))
export default class ExamReport extends PureComponent {
  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取报告详情
    dispatch({
      type: 'generalFile/fetchMultipleReport',
      payload: {
        examId: id,
      },
    });
  }

  // 下载
  reportDownload = () => {};

  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="综合分析报告"
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
          height="800"
          scrolling="no"
          src={`#/training/generalFile/examFileReport/${id}`}
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
