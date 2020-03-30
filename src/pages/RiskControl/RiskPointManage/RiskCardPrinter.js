import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const title = '风险告知卡预览数据';

function cardDownload() {
  const iframe = document.getElementById('riskCardIframe').contentWindow;
  iframe.print();
}

function setIframeHeight() {
  const ifm = document.getElementById('riskCardIframe');
  if (
    navigator.userAgent.indexOf('MSIE') > 0 ||
    navigator.userAgent.indexOf('rv:11') > 0 ||
    navigator.userAgent.indexOf('Firefox') > 0
  ) {
    ifm.height = ifm.contentWindow.document.body.scrollHeight;
  } else {
    ifm.height = ifm.contentWindow.document.documentElement.scrollHeight;
  }
}

window.onresize = function() {
  setTimeout(() => {
    setIframeHeight();
  }, 1000);
};

/**
 * 风险告知卡打印预览数据
 */
@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class RiskCardPrinter extends PureComponent {
  // state = {};

  /**
   * 挂载后
   */
  // componentDidMount() {}

  goBack = () => {
    const {
      location: {
        query: { companyName, companyId, itemId },
      },
      dispatch,
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/risk-point-manage/risk-card-list/${itemId}?companyName=${companyName}&companyId=${companyId}`
      )
    );
  };

  /**
   * 渲染函数
   */
  render() {
    const {
      location: {
        query: { companyName, companyId, itemId, isShowEwm },
      },
      match: {
        params: { id },
      },
    } = this.props;

    /* 面包屑 */
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '单位风险点',
        name: '单位风险点',
        href: `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title: '风险告知卡',
        name: '风险告知卡',
        href: `/risk-control/risk-point-manage/risk-card-list/${itemId}?companyName=${companyName}&companyId=${companyId}`,
      },
      {
        title,
        name: '风险告知卡预览数据',
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>{companyName}</span>
            <Form layout="inline">
              <Col>
                <Form.Item style={{ float: 'right' }}>
                  <Button onClick={this.goBack}>返回</Button>
                </Form.Item>
                <Form.Item style={{ float: 'right' }}>
                  <Button type="primary" onClick={cardDownload}>
                    打印
                  </Button>
                </Form.Item>
                {/* <span>（注:打印预览界面请勾选上背景图形选项展示卡片背景色）</span> */}
              </Col>
            </Form>
          </div>
        }
      >
        <iframe
          title="riskCard"
          frameBorder="0"
          id="riskCardIframe"
          width="100%"
          // height="2000"
          scrolling="no"
          src={`#/risk-control/risk-point-manage/card-printer-content/${id}?isShowEwm=${isShowEwm}`}
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
