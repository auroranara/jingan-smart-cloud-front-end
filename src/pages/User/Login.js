import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert, Icon, Card, Row, Col, List } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { aesEncrypt } from '../../utils/utils';

const { /* Tab, */ UserName, Password, /* Mobile, Captcha, */ Submit } = Login;
// const PROJECT_CONFIG = global.PROJECT_CONFIG;

const isEye = process.env.PROJECT_ENV === 'eye';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    notice: '',
    type: 'account',
    autoLogin: true,
    isMoreUser: false,
    username: null,
    password: null,
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

  // 提交
  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      const pass = aesEncrypt(values.password)
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password: pass,
          type,
        },
        error: msg => {
          this.setState({ notice: msg })
        },
        handleMoreUser: () => {
          this.setState({
            isMoreUser: true,
            username: values.username,
            password: pass,
          })
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
    window.open('/gsafe/download.html', '_self');
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  handleSelect = (userId) => {
    const { dispatch } = this.props
    const { username, password } = this.state
    dispatch({
      type: 'login/loginWithUserId',
      payload: {
        userId,
        username,
        password,
      },
    })

  }

  renderLogin = () => {
    const { submitting } = this.props;
    const { type, notice } = this.state;
    return (
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
          {notice && (
            <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />
          )}
          <UserName name="username" placeholder="用户名/手机号" />
          <Password
            name="password"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
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
        {isEye && (
          <div className={styles.other}>
            <Link to="/user/activation">账号激活</Link>
            <Link to="/user/forget-password">忘记密码</Link>
          </div>
        )}
        <Submit style={{ marginTop: '15px' }} loading={submitting}>
          登录
          </Submit>
        <div className={styles.downloadContainer}>
          <span onClick={this.handleToDownload} className={styles.download}>
            <Icon type="download" />
            APP下载
            </span>
        </div>
      </Login>
    )
  }

  /* renderMoreUser = () => {
    const { login: { users } } = this.props

    return users.map(item => (
      <div key={item.userId} className={styles.cardItem}>
        <Card.Grid onClick={() => this.handleSelect(item.userId)} className={styles.card}>
          <span>{item.unitName}</span>
        </Card.Grid>
      </div>
    ))
  } */

  renderMoreUser = () => {
    let { login: { users } } = this.props
    users = users.slice(0, 5)
    return (
      <List
        dataSource={users}
        split={false}
        renderItem={item => (
          <List.Item key={item.userId} className={styles.listItem}>
            <Card.Grid onClick={() => this.handleSelect(item.userId)} className={styles.cardGrid}>
              <span>{item.unitName}</span>
            </Card.Grid>
          </List.Item>
        )}
      >

      </List>
    )
  }

  render() {
    const { isMoreUser } = this.state
    return (
      <div style={{ marginTop: '90px' }}>
        {isMoreUser ? (
          <div className={styles.mainContainer}>
            <div className={styles.container}>
              {this.renderMoreUser()}
            </div>
          </div>) : (
            <div className={styles.main}>
              {this.renderLogin()}
            </div>
          )}
      </div>
    );
  }
}
