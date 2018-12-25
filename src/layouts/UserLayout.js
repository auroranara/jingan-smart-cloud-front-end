import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Alert } from 'antd';

import GlobalFooter from 'components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import DocumentTitle from 'react-document-title';

const links = [];
// console.log('PROJECT_CONFIG', global.PROJECT_CONFIG);
const { serviceSupport, servicePhone, projectName } = global.PROJECT_CONFIG;

const alertContent = () => {
  const ua = window.navigator.userAgent,
    isChrome = ua.indexOf('Chrome') && window.chrome;
  if (!isChrome) {
    return (
      <Alert
        style={{ zIndex: 99 }}
        message={'推荐使用 Chrome 浏览器获得完整功能。'}
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
          Copyright <Icon type="copyright" /> 2018 &nbsp;技术支持：无锡晶安智慧科技有限公司
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
