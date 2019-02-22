import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Alert } from 'antd';

import GlobalFooter from 'components/GlobalFooter';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';
import DocumentTitle from 'react-document-title';

const links = [];
// console.log('PROJECT_CONFIG', global.PROJECT_CONFIG);
const { serviceSupport, servicePhone, projectName, logo } = global.PROJECT_CONFIG;

const BrowserType = () => {
  const userAgent = window.navigator.userAgent; //取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf('Opera') > -1; //判断是否Opera浏览器
  // var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  const isIE = window.ActiveXObject || 'ActiveXObject' in window;
  // var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
  const isEdge = userAgent.indexOf('Edge') > -1; //判断是否IE的Edge浏览器
  const isFF = userAgent.indexOf('Firefox') > -1; //判断是否Firefox浏览器
  const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1; //判断是否Safari浏览器
  const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && !isEdge; //判断Chrome浏览器

  if (isIE) {
    return 'IE';
  }
  if (isFF) {
    return 'FF';
  }
  if (isOpera) {
    return 'Opera';
  }
  if (isSafari) {
    return 'Safari';
  }
  if (isChrome) {
    return 'Chrome';
  }
  if (isEdge) {
    return 'Edge';
  } else return 'other';
};

const alertContent = () => {
  const type = BrowserType();

  if (type !== 'Chrome') {
    return (
      <Alert
        style={{ zIndex: 99 }}
        message={'推荐使用 Chrome 浏览器或360浏览器急速模式获得完整功能。'}
        banner
        closable
      />
    );
  }
};

@connect(({ login }) => ({
  login,
}))
export default class UserLayout extends PureComponent {
  render() {
    const { children } = this.props;
    const copyright = (
      <Fragment>
        <p>
          Copyright <Icon type="copyright" /> 2019 &nbsp;技术支持：无锡晶安智慧科技有限公司
        </p>
        {serviceSupport && (
          <p style={{ marginTop: '5px' }}>
            服务支持：
            {serviceSupport}
          </p>
        )}
        {servicePhone && (
          <p style={{ marginTop: '5px' }}>
            服务电话：
            {servicePhone}
          </p>
        )}
      </Fragment>
    );

    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          {alertContent()}
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{projectName}</span>
              </div>
              <div className={styles.desc} />
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}
