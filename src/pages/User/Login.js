import React, { Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { aesEncrypt } from '../../utils/utils';

const { /* Tab, */ UserName, Password, /* Mobile, Captcha, */ Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    notice: '',
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () => {
    return new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password: aesEncrypt(values.password),
          type,
        },
        callback: (response) => {
          if (response.code === 200) {
            if (response.data.currentAuthority === 'admin') {
              dispatch({
                type: 'setting/changeSetting',
                payload: { grid: 'Fluid', layout: 'sidemenu' },
              });
            } else if (response.data.currentAuthority === 'user') {
              dispatch({
                type: 'setting/changeSetting',
                payload: { grid: 'Wide', layout: 'topmenu' },
              });
            }
          } else this.setState({ notice: response.msg })
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleToDownload = () => {
    window.open('/gsafe/download.html', '_self')
  }

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { submitting } = this.props;
    const { type, autoLogin, notice } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {/* <div className={styles.tab}>
            <span className={styles.pane}>账户密码登录</span>
          </div> */}
          <div style={{ marginTop: '28px', display: 'block' }}>
            {notice && <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />}
            <UserName name="username" placeholder="用户名/手机号" />
            <Password name="password" onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)} />
          </div>
          {/* <Tab key="account" tab="账户密码登录">
            {notice && <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />}
            <UserName name="username" />
            <Password name="password" />
          </Tab> */}
          {/* <Tab key="mobile" tab="手机号登录">
            {notice && <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />}
            <Mobile name="mobile" />
            <Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />
          </Tab> */}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              保存为本地常用账号
            </Checkbox>
            {/* <a style={{ float: 'right' }} href="">
              忘记密码
            </a> */}
          </div>
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/User/Register">
              注册账户
            </Link>
          </div> */}
          <div className={styles.other}>
            <span onClick={this.handleToDownload} className={styles.download}><Icon type="download" />APP下载</span>
          </div>
        </Login>
      </div>
    );
  }
}
