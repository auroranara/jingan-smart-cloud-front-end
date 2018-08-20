import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button } from 'antd';
import Result from 'components/Result';
import styles from './style.less';

@connect()
export default class OperationResult extends React.PureComponent {
  render() {
    const { location: { pathname } } = this.props;
    const pathList = pathname.split('/');
    const type = pathList[pathList.length - 2]

    const actions = (
      <div className={styles.actions}>
        <Button onClick={() => toLogin()} size="large" type="primary">返回登录页</Button>
      </div>
    );

    const toLogin = () => {
      const { dispatch } = this.props
      dispatch(routerRedux.push('/user/login'));
    };
    return (
      <Result
        className={styles.registerResult}
        type="success"
        title={
          <div className={styles.title}>
            {type === 'activation' ? (<span>恭喜您！激活成功！<br /></span>) : (<span>恭喜您！重置成功！<br /></span>)}
            <span>请返回登录页进入平台</span>
          </div>
        }
        actions={actions}
        style={{ marginTop: 56 }}
      />
    );
  }
}

