import React, { PureComponent } from 'react';
import { Button, Spin, Card } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

@connect(state => ({
  isloading: state.error.isloading,
}))
export default class TriggerException extends PureComponent {
  state = {
    isloading: false,
  };
<<<<<<< HEAD

=======
>>>>>>> init
  triggerError = code => {
    this.setState({
      isloading: true,
    });
<<<<<<< HEAD
    const { dispatch } = this.props;
    dispatch({
=======
    this.props.dispatch({
>>>>>>> init
      type: 'error/query',
      payload: {
        code,
      },
    });
  };
<<<<<<< HEAD

  render() {
    const { isloading } = this.state;
    return (
      <Card>
        <Spin spinning={isloading} wrapperClassName={styles.trigger}>
=======
  render() {
    return (
      <Card>
        <Spin spinning={this.state.isloading} wrapperClassName={styles.trigger}>
>>>>>>> init
          <Button type="danger" onClick={() => this.triggerError(401)}>
            触发401
          </Button>
          <Button type="danger" onClick={() => this.triggerError(403)}>
            触发403
          </Button>
          <Button type="danger" onClick={() => this.triggerError(500)}>
            触发500
          </Button>
          <Button type="danger" onClick={() => this.triggerError(404)}>
            触发404
          </Button>
        </Spin>
      </Card>
    );
  }
}
