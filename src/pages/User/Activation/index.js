import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Steps, Row, Col } from 'antd';
import styles from './style.less';

const { Step } = Steps;

export default class Register extends PureComponent {
  getCurrentStep() {
    const { location: { pathname } } = this.props;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'verification': return 0;
      case 'set-password': return 1;
      case 'result': return 2;
      default: return 0;
    }
  }
  render() {
    const { children, location: { pathname } } = this.props;
    const pathList = pathname.split('/');
    const type = pathList[pathList.length - 2]

    return (
      <Fragment>
        <Row>
          <Col
            lg={{ span: 12, offset: 6 }}
            md={{ span: 16, offset: 4 }}
            sm={{ span: 18, offset: 3 }}
            xs={{ span: 20, offset: 2 }}
          >
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="手机验证" />
              <Step title="设置密码" />
              <Step title={type === 'activation' ? '激活成功' : '重置成功'} />
            </Steps>
          </Col>
        </Row>
        {children}
      </Fragment>
    );
  }
}
